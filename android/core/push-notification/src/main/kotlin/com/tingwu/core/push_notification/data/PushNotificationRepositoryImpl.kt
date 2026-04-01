package com.tingwu.core.push_notification.data

import android.app.Activity
import android.content.Context
import com.google.firebase.messaging.FirebaseMessaging
import com.tingwu.core.auth.data.AuthRepository
import com.tingwu.core.network.data.ApiClient
import com.tingwu.core.push_notification.domain.Notification
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.tasks.await
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PushNotificationRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val apiClient: ApiClient,
    private val authRepository: AuthRepository,
    private val permissionManager: PermissionManager
) : PushNotificationRepository {
    
    private val notificationReceivedCallbacks = mutableListOf<(Notification) -> Unit>()
    private val notificationTappedCallbacks = mutableListOf<(Notification) -> Unit>()
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    
    private val _notifications = MutableStateFlow<List<Notification>>(emptyList())
    val notifications: StateFlow<List<Notification>> = _notifications.asStateFlow()
    
    override suspend fun requestPermission(): Result<Boolean> {
        return try {
            // 检查是否已登录（需要用户信息来关联设备令牌）
            val isLoggedIn = authRepository.getToken().isSuccess
            
            if (!isLoggedIn) {
                return Result.failure(Exception("User not logged in"))
            }
            
            // 检查并请求权限
            val hasPermission = permissionManager.hasNotificationPermission()
            
            if (hasPermission) {
                // 已有权限，直接注册设备令牌
                registerDeviceToken()
                Result.success(true)
            } else {
                // 需要请求权限（这里简化处理，实际需要在 Activity 中请求）
                Result.success(false)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun registerDeviceToken(): Result<Unit> {
        return try {
            // 获取 FCM 令牌
            val token = FirebaseMessaging.getInstance().token.await()
            
            // 获取用户令牌
            val userTokenResult = authRepository.getToken()
            if (userTokenResult.isFailure) {
                return Result.failure(Exception("User not authenticated"))
            }
            
            val userToken = userTokenResult.getOrNull() ?: return Result.failure(Exception("No user token"))
            
            // 上报设备令牌到后端
            val response = apiClient.registerDeviceToken("Bearer $userToken", mapOf(
                "device_token" to token,
                "device_type" to "android",
                "device_id" to getDeviceId()
            ))
            
            if (response.code == 200) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to register device token: ${response.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun unregisterDeviceToken(): Result<Unit> {
        return try {
            val userTokenResult = authRepository.getToken()
            if (userTokenResult.isFailure) {
                return Result.failure(Exception("User not authenticated"))
            }
            
            val userToken = userTokenResult.getOrNull() ?: return Result.failure(Exception("No user token"))
            
            // 从后端注销设备令牌
            val response = apiClient.unregisterDeviceToken("Bearer $userToken", mapOf(
                "device_id" to getDeviceId()
            ))
            
            if (response.code == 200) {
                // 删除本地令牌（可选）
                FirebaseMessaging.getInstance().deleteToken()
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to unregister device token: ${response.message}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override fun onNotificationReceived(callback: (notification: Notification) -> Unit) {
        notificationReceivedCallbacks.add(callback)
    }
    
    override fun onNotificationTapped(callback: (notification: Notification) -> Unit) {
        notificationTappedCallbacks.add(callback)
    }
    
    override suspend fun handleDeepLink(url: String): Result<Unit> {
        return try {
            // 解析深度链接并处理
            // 例如: tingwu://practice/123, tingwu://result/456
            when {
                url.startsWith("tingwu://practice/") -> {
                    val practiceId = url.removePrefix("tingwu://practice/")
                    // 打开练习界面
                    // TODO: 导航到练习界面
                    Result.success(Unit)
                }
                url.startsWith("tingwu://result/") -> {
                    val resultId = url.removePrefix("tingwu://result/")
                    // 打开结果详情界面
                    // TODO: 导航到结果详情界面
                    Result.success(Unit)
                }
                else -> Result.success(Unit)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // 内部方法，供 FcmNotificationService 调用
    fun triggerNotificationReceived(notification: Notification) {
        scope.launch {
            // 添加到通知列表
            _notifications.update { current ->
                current + notification
            }
            
            // 触发回调
            notificationReceivedCallbacks.forEach { callback ->
                try {
                    callback(notification)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
    
    fun triggerNotificationTapped(notification: Notification) {
        scope.launch {
            // 触发回调
            notificationTappedCallbacks.forEach { callback ->
                try {
                    callback(notification)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
    
    fun clearNotifications() {
        scope.launch {
            _notifications.update { emptyList() }
        }
    }
    
    fun markNotificationAsRead(notificationId: String) {
        scope.launch {
            _notifications.update { current ->
                current.filterNot { it.id == notificationId }
            }
        }
    }
    
    private fun getDeviceId(): String {
        // 生成或获取设备唯一标识符
        val prefs = context.getSharedPreferences("device_prefs", Context.MODE_PRIVATE)
        var deviceId = prefs.getString("device_id", null)
        
        if (deviceId == null) {
            deviceId = UUID.randomUUID().toString()
            prefs.edit().putString("device_id", deviceId).apply()
        }
        
        return deviceId
    }
    
    // 工具方法
    suspend fun subscribeToTopic(topic: String): Result<Unit> {
        return try {
            FirebaseMessaging.getInstance().subscribeToTopic(topic).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun unsubscribeFromTopic(topic: String): Result<Unit> {
        return try {
            FirebaseMessaging.getInstance().unsubscribeFromTopic(topic).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    fun initialize() {
        // 创建通知渠道
        FcmNotificationService.createNotificationChannel(context)
        
        // 自动注册设备令牌（如果已登录）
        scope.launch {
            try {
                delay(5000) // 等待应用启动
                if (authRepository.getToken().isSuccess && permissionManager.hasNotificationPermission()) {
                    registerDeviceToken()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    
    fun cleanup() {
        scope.coroutineContext.cancel()
    }
}