package com.tingwu.core.offline_sync.data

import android.content.Context
import androidx.work.WorkManager
import com.tingwu.core.offline_sync.data.local.SyncDatabase
import com.tingwu.core.offline_sync.data.local.SyncEntity
import com.tingwu.core.offline_sync.data.network.NetworkStatusMonitor
import com.tingwu.core.offline_sync.data.worker.SyncWorker
import com.tingwu.core.offline_sync.domain.SyncData
import com.tingwu.core.offline_sync.domain.SyncStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OfflineSyncRepositoryImpl @Inject constructor(
    private val context: Context,
    private val networkStatusMonitor: NetworkStatusMonitor
) : OfflineSyncRepository {
    
    private val database = SyncDatabase.getInstance(context)
    private val workManager = WorkManager.getInstance(context)
    private val scope = CoroutineScope(Dispatchers.IO)
    
    private val networkStatusFlow = networkStatusMonitor.networkStatus
        .stateIn(scope, SharingStarted.Eagerly, networkStatusMonitor.isOnlineNow())
    
    override fun isOnline(): Boolean = networkStatusMonitor.isOnlineNow()
    
    override fun onNetworkStatusChange(callback: (online: Boolean) -> Unit) {
        scope.launch {
            networkStatusFlow.collect { isOnline ->
                callback(isOnline)
                
                // 网络恢复时尝试同步
                if (isOnline) {
                    launch { sync() }
                }
            }
        }
    }
    
    override suspend fun addToSyncQueue(data: SyncData): Result<Unit> {
        return try {
            val entity = SyncEntity(
                id = data.id,
                dataType = data.dataType,
                dataId = data.dataId,
                payload = data.payload,
                priority = data.priority,
                retryCount = data.retryCount,
                maxRetries = data.maxRetries,
                status = data.status,
                createdAt = data.createdAt
            )
            
            database.syncDao().insert(entity)
            
            // 如果在线，立即尝试同步
            if (isOnline()) {
                SyncWorker.syncNow(context)
            }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getSyncQueue(): Result<List<SyncData>> {
        return try {
            val entities = database.syncDao().getByStatus("pending") +
                         database.syncDao().getByStatus("syncing") +
                         database.syncDao().getByStatus("failed")
            
            val syncDataList = entities.map { entity ->
                SyncData(
                    id = entity.id,
                    dataType = entity.dataType,
                    dataId = entity.dataId,
                    payload = entity.payload,
                    priority = entity.priority,
                    retryCount = entity.retryCount,
                    maxRetries = entity.maxRetries,
                    status = entity.status,
                    createdAt = entity.createdAt
                )
            }
            
            Result.success(syncDataList)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun clearSyncQueue(): Result<Unit> {
        return try {
            database.syncDao().clearAll()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun sync(): Result<SyncStatus> {
        return try {
            if (!isOnline()) {
                return Result.failure(Exception("Network unavailable"))
            }
            
            // 立即同步
            SyncWorker.syncNow(context)
            
            // 获取同步状态
            val status = getSyncStatus()
            Result.success(status)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun retryFailedSync(): Result<Unit> {
        return try {
            val now = System.currentTimeMillis()
            database.syncDao().updateStatus("failed", "pending", now)
            
            // 启动同步
            if (isOnline()) {
                SyncWorker.syncNow(context)
            }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getSyncStatus(): SyncStatus {
        return try {
            val pendingCount = database.syncDao().countByStatus("pending")
            val syncingCount = database.syncDao().countByStatus("syncing")
            val failedCount = database.syncDao().countByStatus("failed")
            
            val lastSyncTime = try {
                val completedItems = database.syncDao().getByStatus("completed")
                completedItems.maxByOrNull { it.updatedAt }?.updatedAt
            } catch (e: Exception) {
                null
            }
            
            SyncStatus(
                isOnline = isOnline(),
                pendingCount = pendingCount,
                syncingCount = syncingCount,
                failedCount = failedCount,
                lastSyncTime = lastSyncTime
            )
        } catch (e: Exception) {
            SyncStatus(isOnline = false, pendingCount = 0, syncingCount = 0, failedCount = 0, lastSyncTime = null)
        }
    }
    
    // 工具方法
    suspend fun addSessionResult(sessionId: String, resultData: String): Result<Unit> {
        val syncData = SyncData(
            id = UUID.randomUUID().toString(),
            dataType = "session_result",
            dataId = sessionId,
            payload = resultData,
            priority = "high"
        )
        return addToSyncQueue(syncData)
    }
    
    suspend fun addPracticeAudio(audioId: String, audioMetadata: String): Result<Unit> {
        val syncData = SyncData(
            id = UUID.randomUUID().toString(),
            dataType = "practice_audio",
            dataId = audioId,
            payload = audioMetadata,
            priority = "normal"
        )
        return addToSyncQueue(syncData)
    }
    
    fun startPeriodicSync() {
        SyncWorker.scheduleSync(context)
    }
    
    fun stopPeriodicSync() {
        workManager.cancelAllWorkByTag(SyncWorker.TAG)
    }
}