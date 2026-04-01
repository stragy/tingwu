package com.tingwu.core.auth.domain

import com.tingwu.core.auth.data.AuthRepository
import javax.inject.Inject

class AuthUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend fun requestSmsCode(phoneNumber: String) = repository.requestSmsCode(phoneNumber)
    suspend fun verifySmsCode(phoneNumber: String, code: String) = repository.verifySmsCode(phoneNumber, code)
    suspend fun getToken() = repository.getToken()
    suspend fun refreshToken() = repository.refreshToken()
    suspend fun isTokenValid() = repository.isTokenValid()
    suspend fun logout() = repository.logout()
    suspend fun getCurrentSession() = repository.getCurrentSession()
    suspend fun clearSession() = repository.clearSession()
}
