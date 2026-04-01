package com.tingwu.core.offline_sync.data

import com.tingwu.core.offline_sync.domain.SyncData
import com.tingwu.core.offline_sync.domain.SyncStatus

interface OfflineSyncRepository {
    fun isOnline(): Boolean
    fun onNetworkStatusChange(callback: (online: Boolean) -> Unit)
    suspend fun addToSyncQueue(data: SyncData): Result<Unit>
    suspend fun getSyncQueue(): Result<List<SyncData>>
    suspend fun clearSyncQueue(): Result<Unit>
    suspend fun sync(): Result<SyncStatus>
    suspend fun retryFailedSync(): Result<Unit>
    suspend fun getSyncStatus(): SyncStatus
}
