package com.tingwu.core.network.data

import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.DELETE
import retrofit2.http.Query
import retrofit2.http.Path
import retrofit2.http.Multipart
import retrofit2.http.Part
import okhttp3.MultipartBody
import okhttp3.RequestBody

interface ApiClient {
    @POST("/auth/request-sms")
    suspend fun requestSmsCode(@Body request: SmsCodeRequest): ApiResponse<Unit>

    @POST("/auth/verify-sms")
    suspend fun verifySmsCode(@Body request: SmsVerifyRequest): ApiResponse<AuthTokenResponse>

    @GET("/auth/refresh")
    suspend fun refreshToken(@Header("Authorization") token: String): ApiResponse<AuthTokenResponse>

    @POST("/auth/logout")
    suspend fun logout(@Header("Authorization") token: String): ApiResponse<Unit>
    
    @POST("/notification/device/register")
    suspend fun registerDeviceToken(
        @Header("Authorization") token: String,
        @Body request: Map<String, String>
    ): ApiResponse<Unit>
    
    @DELETE("/notification/device/unregister")
    suspend fun unregisterDeviceToken(
        @Header("Authorization") token: String,
        @Body request: Map<String, String>
    ): ApiResponse<Unit>

    // ====== 练习相关接口 ======

    @GET("/exercises")
    suspend fun getExercises(
        @Header("Authorization") token: String,
        @Query("type") type: String? = null,
        @Query("difficulty") difficulty: String? = null,
        @Query("page") page: Int = 1,
        @Query("pageSize") pageSize: Int = 20
    ): ApiResponse<ExerciseListResponse>

    @GET("/exercises/{id}")
    suspend fun getExerciseDetail(
        @Header("Authorization") token: String,
        @Path("id") exerciseId: String
    ): ApiResponse<ExerciseDetailResponse>

    // ====== 评测相关接口 ======
    // Multipart 上传：非文件字段使用 RequestBody，文件字段使用 MultipartBody.Part

    @Multipart
    @POST("/evaluations/submit")
    suspend fun submitEvaluation(
        @Part("sessionId") sessionId: RequestBody,
        @Part("exerciseId") exerciseId: RequestBody,
        @Part("duration") duration: RequestBody,
        @Part audioFile: MultipartBody.Part
    ): ApiResponse<EvaluationResponse>

    @GET("/evaluations/{id}")
    suspend fun getEvaluationDetail(
        @Header("Authorization") token: String,
        @Path("id") evaluationId: String
    ): ApiResponse<EvaluationResponse>

    @GET("/evaluations/history")
    suspend fun getEvaluationHistory(
        @Header("Authorization") token: String,
        @Query("offset") offset: Int = 0,
        @Query("limit") limit: Int = 20
    ): ApiResponse<EvaluationListResponse>

    @GET("/evaluations/statistics")
    suspend fun getEvaluationStatistics(
        @Header("Authorization") token: String
    ): ApiResponse<StatisticsResponse>
}

data class SmsCodeRequest(val phoneNumber: String)
data class SmsVerifyRequest(val phoneNumber: String, val code: String)
data class AuthTokenResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long
)

data class ApiResponse<T>(
    val code: Int,
    val message: String,
    val data: T?
)

// ====== 练习相关数据模型 ======

data class ExerciseItem(
    val id: String,
    val title: String,
    val type: String,
    val difficulty: String,
    val duration: Int,
    val coverUrl: String? = null
)

data class ExerciseListResponse(
    val items: List<ExerciseItem>,
    val total: Int,
    val page: Int,
    val pageSize: Int
)

data class ExerciseDetailResponse(
    val id: String,
    val title: String,
    val type: String,
    val difficulty: String,
    val content: ExerciseContent
)

data class ExerciseContent(
    val instructions: String,
    val sentences: List<ExerciseSentence>,
    val audioUrl: String? = null
)

data class ExerciseSentence(
    val index: Int,
    val text: String,
    val translation: String? = null,
    val audioUrl: String? = null
)

// ====== 评测相关数据模型 ======

data class EvaluationResponse(
    val id: String,
    val sessionId: String,
    val exerciseId: String,
    val totalScore: Float,
    val pronunciationScore: Float,
    val fluencyScore: Float,
    val contentScore: Float,
    val duration: Long,
    val feedback: String,
    val details: List<EvaluationSentenceResponse>,
    val createdAt: Long
)

data class EvaluationSentenceResponse(
    val text: String,
    val userText: String,
    val score: Float,
    val words: List<EvaluationWordResponse>
)

data class EvaluationWordResponse(
    val word: String,
    val userWord: String?,
    val score: Float,
    val status: String
)

data class EvaluationListResponse(
    val items: List<EvaluationResponse>,
    val total: Int
)

data class StatisticsResponse(
    val totalPractices: Int,
    val averageScore: Float,
    val averagePronunciation: Float,
    val averageFluency: Float,
    val averageContent: Float,
    val bestScore: Float,
    val streakDays: Int,
    val totalDurationMs: Long
)
