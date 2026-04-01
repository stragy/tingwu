package com.tingwu.app.di

import com.tingwu.core.auth.data.AuthRepository
import com.tingwu.core.auth.domain.AuthToken
import com.tingwu.core.auth.domain.Session
import com.tingwu.core.evaluation.data.EvaluationRepository
import com.tingwu.core.evaluation.data.EvaluationRepositoryImpl
import com.tingwu.core.offline_sync.data.OfflineSyncRepository
import com.tingwu.core.offline_sync.data.OfflineSyncRepositoryImpl
import com.tingwu.core.offline_sync.data.network.NetworkStatusMonitor
import com.tingwu.core.session.data.SessionRepository
import com.tingwu.core.storage.data.LocalStorageRepository
import com.tingwu.core.push_notification.data.PushNotificationRepository
import com.tingwu.core.push_notification.data.PushNotificationRepositoryImpl
import com.tingwu.core.push_notification.data.PermissionManager
import com.tingwu.core.audio.data.AudioEngine
import com.tingwu.core.audio.impl.MediaRecorderAudioEngine
import com.tingwu.core.storage.impl.EncryptedLocalStorage
import com.tingwu.core.network.data.ApiClient
import com.tingwu.core.network.data.ExerciseRepository
import com.tingwu.core.network.data.ExerciseRepositoryImpl
import com.tingwu.core.network.data.ExerciseTokenProvider
import com.tingwu.core.network.data.SmsCodeRequest
import com.tingwu.core.network.data.SmsVerifyRequest
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
import java.util.concurrent.ConcurrentHashMap
import java.util.UUID
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideAuthRepository(
        apiClient: ApiClient,
        localStorage: LocalStorageRepository,
    ): AuthRepository {
        val ACCESS_TOKEN_KEY = "access_token"
        val REFRESH_TOKEN_KEY = "refresh_token"
        val EXPIRES_AT_KEY = "expires_at_ms"

        suspend fun storeTokens(token: AuthToken) {
            localStorage.save(ACCESS_TOKEN_KEY, token.accessToken)
            localStorage.save(REFRESH_TOKEN_KEY, token.refreshToken)
            // expiresIn is in seconds in this codebase
            val expiresAt = System.currentTimeMillis() + token.expiresIn * 1000
            localStorage.save(EXPIRES_AT_KEY, expiresAt)
        }

        return object : AuthRepository {
            override suspend fun requestSmsCode(phoneNumber: String): Result<Unit> {
                return try {
                    val response = apiClient.requestSmsCode(SmsCodeRequest(phoneNumber))
                    if (response.code == 200) {
                        Result.success(Unit)
                    } else {
                        Result.failure(Exception(response.message))
                    }
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun verifySmsCode(phoneNumber: String, code: String): Result<AuthToken> {
                return try {
                    val response = apiClient.verifySmsCode(SmsVerifyRequest(phoneNumber, code))
                    val data = response.data
                    if (response.code == 200 && data != null) {
                        val token = AuthToken(
                            accessToken = data.accessToken,
                            refreshToken = data.refreshToken,
                            expiresIn = data.expiresIn
                        )
                        storeTokens(token)
                        Result.success(token)
                    } else {
                        Result.failure(Exception(response.message))
                    }
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun getToken(): Result<String> {
                return try {
                    val token = localStorage.load(ACCESS_TOKEN_KEY).getOrNull() as? String
                    if (token.isNullOrBlank()) {
                        Result.failure(Exception("Access token not found"))
                    } else {
                        Result.success(token)
                    }
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun refreshToken(): Result<AuthToken> {
                return try {
                    val refreshToken = localStorage.load(REFRESH_TOKEN_KEY).getOrNull() as? String
                    if (refreshToken.isNullOrBlank()) {
                        return Result.failure(Exception("Refresh token not found"))
                    }

                    val response = apiClient.refreshToken("Bearer $refreshToken")
                    val data = response.data
                    if (response.code == 200 && data != null) {
                        val newToken = AuthToken(
                            accessToken = data.accessToken,
                            refreshToken = data.refreshToken,
                            expiresIn = data.expiresIn
                        )
                        storeTokens(newToken)
                        Result.success(newToken)
                    } else {
                        Result.failure(Exception(response.message))
                    }
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun isTokenValid(): Result<Boolean> {
                return try {
                    val rawValue = localStorage.load(EXPIRES_AT_KEY).getOrNull()
                    // EncryptedSharedPreferences 存储的值是字符串，需要解析
                    val expiresAt = when (rawValue) {
                        is Long   -> rawValue
                        is String -> rawValue.toLongOrNull()
                        else      -> null
                    }
                    Result.success(expiresAt != null && expiresAt > System.currentTimeMillis())
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun logout(): Result<Unit> {
                return try {
                    val refreshToken = localStorage.load(REFRESH_TOKEN_KEY).getOrNull() as? String
                    if (!refreshToken.isNullOrBlank()) {
                        // Best-effort; backend revokes by refresh token.
                        apiClient.logout("Bearer $refreshToken")
                    }
                    localStorage.delete(ACCESS_TOKEN_KEY)
                    localStorage.delete(REFRESH_TOKEN_KEY)
                    localStorage.delete(EXPIRES_AT_KEY)
                    Result.success(Unit)
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun getCurrentSession(): Result<Session> = Result.failure(Exception("Not implemented"))
            override suspend fun clearSession() = Result.success(Unit)
        }
    }

    @Provides
    @Singleton
    fun provideNetworkStatusMonitor(@ApplicationContext context: Context): NetworkStatusMonitor {
        return NetworkStatusMonitor(context)
    }

    @Provides
    @Singleton
    fun provideOfflineSyncRepository(
        @ApplicationContext context: Context,
        networkStatusMonitor: NetworkStatusMonitor
    ): OfflineSyncRepository {
        return OfflineSyncRepositoryImpl(context, networkStatusMonitor)
    }

    @Provides
    @Singleton
    fun provideSessionRepository(): SessionRepository {
        val sessions = ConcurrentHashMap<String, com.tingwu.core.session.domain.Session>()
        var currentSessionId: String? = null
        var autoSaveJob: Job? = null
        val scope = CoroutineScope(Dispatchers.IO)

        return object : SessionRepository {
            override suspend fun createSession(exerciseId: String): Result<com.tingwu.core.session.domain.Session> {
                return try {
                    val session = com.tingwu.core.session.domain.Session(
                        id = UUID.randomUUID().toString(),
                        userId = "local_user",
                        exerciseId = exerciseId,
                        startTime = System.currentTimeMillis(),
                        status = "in_progress"
                    )
                    sessions[session.id] = session
                    currentSessionId = session.id
                    Result.success(session)
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }

            override suspend fun saveSession(session: com.tingwu.core.session.domain.Session): Result<Unit> {
                sessions[session.id] = session
                return Result.success(Unit)
            }

            override suspend fun loadSession(sessionId: String): Result<com.tingwu.core.session.domain.Session> {
                val session = sessions[sessionId]
                return if (session != null) Result.success(session)
                else Result.failure(Exception("Session $sessionId not found"))
            }

            override suspend fun completeSession(session: com.tingwu.core.session.domain.Session): Result<Unit> {
                autoSaveJob?.cancel()
                autoSaveJob = null
                val completed = session.copy(
                    endTime = System.currentTimeMillis(),
                    status = "completed"
                )
                sessions[session.id] = completed
                currentSessionId = null
                return Result.success(Unit)
            }

            override suspend fun pauseSession(): Result<Unit> {
                currentSessionId?.let { id ->
                    sessions[id]?.let { s ->
                        sessions[id] = s.copy(status = "paused")
                    }
                }
                return Result.success(Unit)
            }

            override suspend fun resumeSession(): Result<Unit> {
                currentSessionId?.let { id ->
                    sessions[id]?.let { s ->
                        sessions[id] = s.copy(status = "in_progress")
                    }
                }
                return Result.success(Unit)
            }

            override fun enableAutoSave(interval: Long) {
                autoSaveJob?.cancel()
                autoSaveJob = scope.launch {
                    while (true) {
                        delay(interval)
                        currentSessionId?.let { id ->
                            sessions[id]?.let { s ->
                                sessions[id] = s.copy(
                                    sessionData = "auto_saved_at=${System.currentTimeMillis()}"
                                )
                            }
                        }
                    }
                }
            }

            override fun disableAutoSave() {
                autoSaveJob?.cancel()
                autoSaveJob = null
            }
        }
    }

    @Provides
    @Singleton
    fun provideLocalStorageRepository(impl: EncryptedLocalStorage): LocalStorageRepository = impl

    @Provides
    @Singleton
    fun providePermissionManager(@ApplicationContext context: Context): PermissionManager {
        return PermissionManager(context)
    }

    @Provides
    @Singleton
    fun providePushNotificationRepository(
        @ApplicationContext context: Context,
        apiClient: ApiClient,
        authRepository: AuthRepository,
        permissionManager: PermissionManager
    ): PushNotificationRepository {
        val repository = PushNotificationRepositoryImpl(context, apiClient, authRepository, permissionManager)
        repository.initialize()
        return repository
    }

    @Provides
    @Singleton
    fun provideAudioEngine(impl: MediaRecorderAudioEngine): AudioEngine = impl

    @Provides
    @Singleton
    fun provideEvaluationRepository(
        @ApplicationContext context: Context,
        apiClient: ApiClient
    ): EvaluationRepository {
        return EvaluationRepositoryImpl(context, apiClient)
    }

    @Provides
    @Singleton
    fun provideExerciseRepository(
        apiClient: ApiClient,
        authRepository: AuthRepository
    ): ExerciseRepository {
        val tokenProvider = ExerciseTokenProvider { authRepository.getToken().getOrNull() }
        return ExerciseRepositoryImpl(apiClient, tokenProvider)
    }
}
