package com.tingwu.core.evaluation.domain

import com.tingwu.core.evaluation.data.EvaluationRepository
import javax.inject.Inject

class EvaluationUseCase @Inject constructor(
    private val repository: EvaluationRepository
) {
    suspend fun submitEvaluation(
        sessionId: String,
        exerciseId: String,
        audioFilePath: String,
        duration: Long
    ): Result<EvaluationResult> {
        return repository.submitEvaluation(sessionId, exerciseId, audioFilePath, duration)
    }

    suspend fun getEvaluation(evaluationId: String): Result<EvaluationResult> {
        return repository.getEvaluation(evaluationId)
    }

    suspend fun getHistory(offset: Int, limit: Int): Result<List<EvaluationResult>> {
        return repository.getHistory(offset, limit)
    }

    suspend fun getStatistics(): Result<PracticeStatistics> {
        return repository.getStatistics()
    }
}

data class PracticeStatistics(
    val totalPractices: Int = 0,
    val averageScore: Float = 0f,
    val averagePronunciation: Float = 0f,
    val averageFluency: Float = 0f,
    val averageContent: Float = 0f,
    val bestScore: Float = 0f,
    val streakDays: Int = 0,
    val totalDurationMs: Long = 0L
)
