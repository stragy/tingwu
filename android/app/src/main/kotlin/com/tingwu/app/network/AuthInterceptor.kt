package com.tingwu.app.network

import com.tingwu.core.auth.data.AuthRepository
import dagger.Lazy
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

/**
 * AuthInterceptor
 *
 * 自动为每个请求注入 Authorization: Bearer <token>。
 * 遇到 401 时尝试刷新 Token 后重试一次。
 *
 * 使用 Lazy<AuthRepository> 打破 NetworkModule ↔ RepositoryModule 循环依赖：
 * OkHttpClient → AuthInterceptor → AuthRepository → ApiClient → OkHttpClient
 * 通过 Lazy 延迟获取，在实际发请求时才真正访问 AuthRepository。
 */
@Singleton
class AuthInterceptor @Inject constructor(
    private val authRepository: Lazy<AuthRepository>
) : Interceptor {

    /** 不需要添加 Token 的路径后缀 */
    private val publicPaths = listOf(
        "/auth/request-sms",
        "/auth/verify-sms",
        "/auth/refresh"
    )

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val path = originalRequest.url.encodedPath

        // 公开端点不注入 Token
        if (publicPaths.any { path.endsWith(it) }) {
            return chain.proceed(originalRequest)
        }

        // 尝试获取当前 Token（使用 Lazy.get() 延迟初始化）
        val token = runBlocking { authRepository.get().getToken().getOrNull() }

        val requestWithAuth = if (token != null) {
            originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        } else {
            originalRequest
        }

        val response = chain.proceed(requestWithAuth)

        // 401 时尝试刷新 Token，并重试一次
        if (response.code == 401 && token != null) {
            response.close()

            val refreshedToken = runBlocking { authRepository.get().refreshToken().getOrNull() }
            if (refreshedToken != null) {
                val retryRequest = originalRequest.newBuilder()
                    .header("Authorization", "Bearer ${refreshedToken.accessToken}")
                    .build()
                return chain.proceed(retryRequest)
            }
        }

        return response
    }
}

