package com.tingwu.core.storage.domain

import com.tingwu.core.storage.data.LocalStorageRepository
import javax.inject.Inject

class LocalStorageUseCase @Inject constructor(
    private val repository: LocalStorageRepository
) {
    suspend fun save(key: String, data: Any) = repository.save(key, data)
    suspend fun load(key: String) = repository.load(key)
    suspend fun delete(key: String) = repository.delete(key)
    suspend fun encryptData(data: Any) = repository.encryptData(data)
    suspend fun decryptData(encrypted: String) = repository.decryptData(encrypted)
    fun setCacheExpiry(key: String, ttl: Long) = repository.setCacheExpiry(key, ttl)
    fun isCacheValid(key: String) = repository.isCacheValid(key)
    suspend fun clearAllData() = repository.clearAllData()
    suspend fun clearExpiredCache() = repository.clearExpiredCache()
}
