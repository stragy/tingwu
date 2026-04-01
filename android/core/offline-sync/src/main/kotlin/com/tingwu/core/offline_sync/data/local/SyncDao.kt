package com.tingwu.core.offline_sync.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface SyncDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: SyncEntity)
    
    @Update
    suspend fun update(entity: SyncEntity)
    
    @Delete
    suspend fun delete(entity: SyncEntity)
    
    @Query("""SELECT * FROM sync_queue ORDER BY 
            CASE priority 
                WHEN 'high' THEN 1 
                WHEN 'normal' THEN 2 
                WHEN 'low' THEN 3 
                ELSE 4 
            END, 
            created_at ASC""")
    fun getAll(): Flow<List<SyncEntity>>
    
    @Query("SELECT * FROM sync_queue WHERE status = :status ORDER BY created_at ASC")
    suspend fun getByStatus(status: String): List<SyncEntity>
    
    @Query("SELECT * FROM sync_queue WHERE id = :id")
    suspend fun getById(id: String): SyncEntity?
    
    @Query("DELETE FROM sync_queue WHERE status = :status AND updated_at < :timestamp")
    suspend fun deleteOldByStatus(status: String, timestamp: Long): Int
    
    @Query("UPDATE sync_queue SET status = :newStatus, updated_at = :timestamp WHERE status = :oldStatus")
    suspend fun updateStatus(oldStatus: String, newStatus: String, timestamp: Long): Int
    
    @Query("SELECT COUNT(*) FROM sync_queue WHERE status = :status")
    suspend fun countByStatus(status: String): Int
    
    @Query("DELETE FROM sync_queue")
    suspend fun clearAll()
}