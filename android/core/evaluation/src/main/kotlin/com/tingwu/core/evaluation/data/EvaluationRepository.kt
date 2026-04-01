package com.tingwu.core.evaluation.data

import com.tingwu.core.evaluation.domain.EvaluationResult
import com.tingwu.core.evaluation.domain.PracticeStatistics

interface EvaluationRepository {
    suspend fun submitEvaluation(
        sessionId: String,
        exerciseId: String,
        audioFilePath: String,
        duration: Long
    ): Result<EvaluationResult>

    suspend fun getEvaluation(evaluationId: String): Result<EvaluationResult>
    suspend fun getHistory(offset: Int, limit: Int): Result<List<EvaluationResult>>
    suspend fun getStatistics(): Result<PracticeStatistics>
}
