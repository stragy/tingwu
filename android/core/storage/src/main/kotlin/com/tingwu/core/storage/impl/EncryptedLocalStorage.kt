package com.tingwu.core.storage.impl

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.google.gson.Gson
import com.tingwu.core.storage.data.LocalStorageRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject
import javax.inject.Singleton

/**
 * EncryptedLocalStorage
 *
 * 基于 EncryptedSharedPreferences（AES-256-GCM）的本地持久化存储。
 * - 数据加密存储在应用私有目录，App 卸载后自动清除
 * - 支持基本类型（String/Int/Long/Float/Boolean）直接存储
 * - 复杂对象通过 Gson JSON 序列化后存储
 * - 通过内存 TTL Map 实现缓存过期
 */
@Singleton
class EncryptedLocalStorage @Inject constructor(
    @ApplicationContext private val context: Context
) : LocalStorageRepository {

    private val prefs: SharedPreferences by lazy {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        EncryptedSharedPreferences.create(
            context,
            "tingwu_secure_prefs",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    private val gson = Gson()

    /** key → 过期时间戳（毫秒），无条目 = 永不过期 */
    private val cacheExpiry = ConcurrentHashMap<String, Long>()

    // ──────────────────────────────────────────────────────────────
    // Basic CRUD
    // ──────────────────────────────────────────────────────────────

    override suspend fun save(key: String, data: Any): Result<Unit> {
        return try {
            val value = when (data) {
                is String  -> data
                is Int     -> data.toString()
                is Long    -> data.toString()
                is Float   -> data.toString()
                is Boolean -> data.toString()
                else       -> gson.toJson(data)   // 复杂对象 JSON 序列化
            }
            prefs.edit().putString(key, value).apply()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("存储失败：${e.message}", e))
        }
    }

    override suspend fun load(key: String): Result<Any?> {
        return try {
            // 过期检查
            val expiry = cacheExpiry[key]
            if (expiry != null && System.currentTimeMillis() > expiry) {
                prefs.edit().remove(key).apply()
                cacheExpiry.remove(key)
                return Result.success(null)
            }
            Result.success(prefs.getString(key, null))
        } catch (e: Exception) {
            Result.failure(Exception("读取失败：${e.message}", e))
        }
    }

    override suspend fun delete(key: String): Result<Unit> {
        return try {
            prefs.edit().remove(key).apply()
            cacheExpiry.remove(key)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("删除失败：${e.message}", e))
        }
    }

    override suspend fun clearAllData(): Result<Unit> {
        return try {
            prefs.edit().clear().apply()
            cacheExpiry.clear()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("清空失败：${e.message}", e))
        }
    }

    override suspend fun clearExpiredCache(): Result<Unit> {
        return try {
            val now = System.currentTimeMillis()
            val expiredKeys = cacheExpiry.entries
                .filter { it.value < now }
                .map { it.key }
            if (expiredKeys.isNotEmpty()) {
                prefs.edit().also { editor ->
                    expiredKeys.forEach { editor.remove(it) }
                }.apply()
                expiredKeys.forEach { cacheExpiry.remove(it) }
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("清理过期缓存失败：${e.message}", e))
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Encryption helpers（底层已加密，此处直接透传）
    // ──────────────────────────────────────────────────────────────

    override suspend fun encryptData(data: Any): Result<String> {
        return Result.success(gson.toJson(data))
    }

    override suspend fun decryptData(encrypted: String): Result<Any> {
        return Result.success(encrypted)
    }

    // ──────────────────────────────────────────────────────────────
    // TTL cache
    // ──────────────────────────────────────────────────────────────

    override fun setCacheExpiry(key: String, ttl: Long) {
        cacheExpiry[key] = System.currentTimeMillis() + ttl
    }

    override fun isCacheValid(key: String): Boolean {
        val expiry = cacheExpiry[key] ?: return true  // 无 TTL = 永久有效
        return System.currentTimeMillis() <= expiry
    }
}
