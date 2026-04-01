package com.tingwu.core.evaluation.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.tingwu.core.evaluation.domain.SentenceResult
import com.tingwu.core.evaluation.domain.WordResult

@Entity(tableName = "evaluation_results")
@TypeConverters(Converters::class)
data class EvaluationEntity(
    @PrimaryKey
    val id: String,
    val sessionId: String,
    val exerciseId: String,
    val totalScore: Float,
    val pronunciationScore: Float,
    val fluencyScore: Float,
    val contentScore: Float,
    val duration: Long,
    val feedback: String,
    val details: List<SentenceResult>,
    val audioFilePath: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromSentenceResultList(value: List<SentenceResult>): String {
        return gson.toJson(value)
    }

    @TypeConverter
    fun toSentenceResultList(value: String): List<SentenceResult> {
        val type = object : TypeToken<List<SentenceResult>>() {}.type
        return gson.fromJson(value, type)
    }
}
