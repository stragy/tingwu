package com.tingwu.core.offline_sync.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo

@Entity(tableName = "sync_queue")
data class SyncEntity(
    @PrimaryKey
    val id: String,
    
    @ColumnInfo(name = "data_type")
    val dataType: String,
    
    @ColumnInfo(name = "data_id")
    val dataId: String,
    
    @ColumnInfo(name = "payload")
    val payload: String,
    
    @ColumnInfo(name = "priority")
    val priority: String = "normal",
    
    @ColumnInfo(name = "retry_count")
    val retryCount: Int = 0,
    
    @ColumnInfo(name = "max_retries")
    val maxRetries: Int = 3,
    
    @ColumnInfo(name = "status")
    val status: String = "pending",
    
    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis(),
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: Long = System.currentTimeMillis(),
    
    @ColumnInfo(name = "error_message")
    val errorMessage: String? = null
)