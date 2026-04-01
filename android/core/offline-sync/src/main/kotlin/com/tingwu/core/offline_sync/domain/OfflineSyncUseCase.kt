package com.tingwu.core.offline_sync.domain

import com.tingwu.core.offline_sync.data.OfflineSyncRepository
import javax.inject.Inject

class OfflineSyncUseCase @Inject constructor(
    private val repository: OfflineSyncRepository
) {
    fun isOnline() = repository.isOnline()
    fun onNetworkStatusChange(callback: (online: Boolean) -> Unit) = repository.onNetworkStatusChange(callback)
    suspend fun addToSyncQueue(data: SyncData) = repository.addToSyncQueue(data)
    suspend fun getSyncQueue() = repository.getSyncQueue()
    suspend fun clearSyncQueue() = repository.clearSyncQueue()
    suspend fun sync() = repository.sync()
    suspend fun retryFailedSync() = repository.retryFailedSync()
    suspend fun getSyncStatus() = repository.getSyncStatus()
}
