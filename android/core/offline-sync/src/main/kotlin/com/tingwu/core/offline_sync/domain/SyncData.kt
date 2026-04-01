package com.tingwu.core.offline_sync.domain

data class SyncData(
    val id: String,
    val dataType: String,
    val dataId: String,
    val payload: String,
    val priority: String = "normal",
    val retryCount: Int = 0,
    val maxRetries: Int = 3,
    val status: String = "pending",
    val createdAt: Long = System.currentTimeMillis()
)

data class SyncStatus(
    val isOnline: Boolean,
    val pendingCount: Int,
    val syncingCount: Int,
    val failedCount: Int,
    val lastSyncTime: Long?
)
