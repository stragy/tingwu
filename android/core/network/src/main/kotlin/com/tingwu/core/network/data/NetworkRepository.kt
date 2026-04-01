package com.tingwu.core.network.data

interface NetworkRepository {
    suspend fun requestSmsCode(phoneNumber: String): Result<Unit>
    suspend fun verifySmsCode(phoneNumber: String, code: String): Result<AuthTokenResponse>
    suspend fun refreshToken(token: String): Result<AuthTokenResponse>
    suspend fun logout(token: String): Result<Unit>
}
