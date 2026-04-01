package com.tingwu.core.storage.data

interface LocalStorageRepository {
    suspend fun save(key: String, data: Any): Result<Unit>
    suspend fun load(key: String): Result<Any?>
    suspend fun delete(key: String): Result<Unit>
    suspend fun encryptData(data: Any): Result<String>
    suspend fun decryptData(encrypted: String): Result<Any>
    fun setCacheExpiry(key: String, ttl: Long)
    fun isCacheValid(key: String): Boolean
    suspend fun clearAllData(): Result<Unit>
    suspend fun clearExpiredCache(): Result<Unit>
}
