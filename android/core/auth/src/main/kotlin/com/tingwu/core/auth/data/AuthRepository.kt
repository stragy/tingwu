package com.tingwu.core.auth.data

import com.tingwu.core.auth.domain.AuthToken
import com.tingwu.core.auth.domain.Session

interface AuthRepository {
    suspend fun requestSmsCode(phoneNumber: String): Result<Unit>
    suspend fun verifySmsCode(phoneNumber: String, code: String): Result<AuthToken>
    suspend fun getToken(): Result<String>
    suspend fun refreshToken(): Result<AuthToken>
    suspend fun isTokenValid(): Result<Boolean>
    suspend fun logout(): Result<Unit>
    suspend fun getCurrentSession(): Result<Session>
    suspend fun clearSession(): Result<Unit>
}
