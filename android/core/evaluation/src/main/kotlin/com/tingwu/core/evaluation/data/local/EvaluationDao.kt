package com.tingwu.core.evaluation.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface EvaluationDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: EvaluationEntity)

    @Query("SELECT * FROM evaluation_results WHERE id = :id")
    suspend fun getById(id: String): EvaluationEntity?

    @Query("SELECT * FROM evaluation_results ORDER BY createdAt DESC LIMIT :limit OFFSET :offset")
    suspend fun getHistory(offset: Int, limit: Int): List<EvaluationEntity>

    @Query("SELECT * FROM evaluation_results ORDER BY createdAt DESC")
    fun getAllFlow(): Flow<List<EvaluationEntity>>

    @Query("SELECT COUNT(*) FROM evaluation_results")
    suspend fun getTotalCount(): Int

    @Query("SELECT AVG(totalScore) FROM evaluation_results")
    suspend fun getAverageScore(): Float?

    @Query("SELECT AVG(pronunciationScore) FROM evaluation_results")
    suspend fun getAveragePronunciation(): Float?

    @Query("SELECT AVG(fluencyScore) FROM evaluation_results")
    suspend fun getAverageFluency(): Float?

    @Query("SELECT AVG(contentScore) FROM evaluation_results")
    suspend fun getAverageContent(): Float?

    @Query("SELECT MAX(totalScore) FROM evaluation_results")
    suspend fun getBestScore(): Float?

    @Query("SELECT SUM(duration) FROM evaluation_results")
    suspend fun getTotalDuration(): Long?

    @Query("SELECT COUNT(DISTINCT date(createdAt / 1000, 'unixepoch', 'localtime')) FROM evaluation_results")
    suspend fun getUniqueDays(): Int

    @Delete
    suspend fun delete(entity: EvaluationEntity)

    @Query("DELETE FROM evaluation_results")
    suspend fun clearAll()
}
