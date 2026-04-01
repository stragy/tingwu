package com.tingwu.core.evaluation.data

import android.content.Context
import com.tingwu.core.evaluation.data.local.EvaluationDao
import com.tingwu.core.evaluation.data.local.EvaluationDatabase
import com.tingwu.core.evaluation.data.local.EvaluationEntity
import com.tingwu.core.evaluation.domain.*
import com.tingwu.core.network.data.ApiClient
import dagger.hilt.android.qualifiers.ApplicationContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.random.Random

@Singleton
class EvaluationRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val apiClient: ApiClient
) : EvaluationRepository {

    private val dao: EvaluationDao by lazy {
        EvaluationDatabase.getInstance(context).evaluationDao()
    }

    override suspend fun submitEvaluation(
        sessionId: String,
        exerciseId: String,
        audioFilePath: String,
        duration: Long
    ): Result<EvaluationResult> {
        return try {
            // 尝试调用后端 API（真实评测）
            val apiResult = trySubmitToBackend(sessionId, exerciseId, audioFilePath, duration)
            if (apiResult != null) {
                dao.insert(toEntity(apiResult))
                Result.success(apiResult)
            } else {
                // 后端不可用 — 降级到本地 Mock 评测
                val mockResult = generateMockResult(sessionId, exerciseId, duration, audioFilePath)
                dao.insert(toEntity(mockResult))
                Result.success(mockResult)
            }
        } catch (e: Exception) {
            // 降级到 Mock
            try {
                val mockResult = generateMockResult(sessionId, exerciseId, duration, audioFilePath)
                dao.insert(toEntity(mockResult))
                Result.success(mockResult)
            } catch (dbError: Exception) {
                Result.failure(dbError)
            }
        }
    }

    /**
     * 尝试调用后端 /evaluations/submit（Multipart）。
     * 成功返回 EvaluationResult，失败返回 null（触发降级）。
     */
    private suspend fun trySubmitToBackend(
        sessionId: String,
        exerciseId: String,
        audioFilePath: String,
        duration: Long
    ): EvaluationResult? {
        return try {
            val audioFile = File(audioFilePath)
            if (!audioFile.exists() || audioFile.length() == 0L) return null

            val mimeType = when {
                audioFilePath.endsWith(".m4a", ignoreCase = true) -> "audio/mp4"
                audioFilePath.endsWith(".mp3", ignoreCase = true) -> "audio/mpeg"
                audioFilePath.endsWith(".wav", ignoreCase = true) -> "audio/wav"
                else -> "audio/mpeg"
            }

            val audioPart = MultipartBody.Part.createFormData(
                "audioFile",
                audioFile.name,
                audioFile.asRequestBody(mimeType.toMediaTypeOrNull())
            )

            val response = apiClient.submitEvaluation(
                sessionId = sessionId.toRequestBody("text/plain".toMediaTypeOrNull()),
                exerciseId = exerciseId.toRequestBody("text/plain".toMediaTypeOrNull()),
                duration = duration.toString().toRequestBody("text/plain".toMediaTypeOrNull()),
                audioFile = audioPart
            )

            val data = response.data ?: return null
            if (response.code != 200 && response.code != 201) return null

            // 将后端响应转换为 EvaluationResult domain 对象
            EvaluationResult(
                id = data.id,
                sessionId = data.sessionId,
                exerciseId = data.exerciseId,
                totalScore = data.totalScore,
                pronunciationScore = data.pronunciationScore,
                fluencyScore = data.fluencyScore,
                contentScore = data.contentScore,
                duration = data.duration,
                feedback = data.feedback,
                details = data.details.map { s ->
                    SentenceResult(
                        text = s.text,
                        userText = s.userText,
                        score = s.score,
                        words = s.words.map { w ->
                            WordResult(
                                word = w.word,
                                userWord = w.userWord ?: w.word,
                                score = w.score
                            )
                        }
                    )
                },
                audioFilePath = audioFilePath,
                createdAt = data.createdAt
            )
        } catch (e: Exception) {
            android.util.Log.w("EvaluationRepo", "Backend evaluation failed, falling back to mock: ${e.message}")
            null
        }
    }

    override suspend fun getEvaluation(evaluationId: String): Result<EvaluationResult> {
        return try {
            val entity = dao.getById(evaluationId)
            if (entity != null) {
                Result.success(toDomain(entity))
            } else {
                Result.failure(Exception("Evaluation not found: $evaluationId"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getHistory(offset: Int, limit: Int): Result<List<EvaluationResult>> {
        return try {
            val entities = dao.getHistory(offset, limit)
            Result.success(entities.map { toDomain(it) })
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getStatistics(): Result<PracticeStatistics> {
        return try {
            val totalPractices = dao.getTotalCount()
            val avgScore = dao.getAverageScore() ?: 0f
            val avgPron = dao.getAveragePronunciation() ?: 0f
            val avgFluency = dao.getAverageFluency() ?: 0f
            val avgContent = dao.getAverageContent() ?: 0f
            val best = dao.getBestScore() ?: 0f
            val totalDuration = dao.getTotalDuration() ?: 0L
            val streakDays = dao.getUniqueDays()

            Result.success(
                PracticeStatistics(
                    totalPractices = totalPractices,
                    averageScore = avgScore,
                    averagePronunciation = avgPron,
                    averageFluency = avgFluency,
                    averageContent = avgContent,
                    bestScore = best,
                    streakDays = streakDays,
                    totalDurationMs = totalDuration
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ---- Mock 数据生成（网络不可用时的降级方案）----

    private fun generateMockResult(
        sessionId: String,
        exerciseId: String,
        duration: Long,
        audioFilePath: String?
    ): EvaluationResult {
        val total = (60 + Random.nextFloat() * 35).coerceIn(0f, 100f)
        val pron = (total - 5 + Random.nextFloat() * 10).coerceIn(0f, 100f)
        val fluency = (total - 3 + Random.nextFloat() * 6).coerceIn(0f, 100f)
        val content = (total - 2 + Random.nextFloat() * 4).coerceIn(0f, 100f)

        val feedback = when {
            total >= 90 -> "非常棒！你的发音非常标准，继续保持！"
            total >= 80 -> "很好！发音清晰流利，注意个别单词的重音。"
            total >= 70 -> "不错！大部分发音正确，注意语调变化。"
            total >= 60 -> "还可以，建议多听原音并跟读练习。"
            else -> "需要加强练习，建议逐句模仿标准发音。"
        }

        val mockSentences = listOf(
            SentenceResult(
                text = "Good morning, everyone. Today we are going to talk about our school life.",
                userText = "Good morning everyone Today we are going to talk about our school life",
                score = (pron - 2 + Random.nextFloat() * 4).coerceIn(0f, 100f),
                words = listOf(
                    WordResult("Good", "Good", 95f),
                    WordResult("morning", "morning", 90f),
                    WordResult("everyone", "everyone", 88f),
                    WordResult("Today", "Today", 92f),
                    WordResult("we", "we", 96f),
                    WordResult("are", "are", 94f),
                    WordResult("going", "going", 91f),
                    WordResult("to", "to", 97f),
                    WordResult("talk", "talk", 89f),
                    WordResult("about", "about", 85f),
                    WordResult("our", "our", 93f),
                    WordResult("school", "school", 90f),
                    WordResult("life", "life", 87f)
                )
            ),
            SentenceResult(
                text = "I usually get up at six o'clock and have breakfast at seven.",
                userText = "I usually get up at six o'clock and have breakfast at seven",
                score = (pron - 5 + Random.nextFloat() * 10).coerceIn(0f, 100f),
                words = listOf(
                    WordResult("I", "I", 98f),
                    WordResult("usually", "usually", 82f),
                    WordResult("get", "get", 95f),
                    WordResult("up", "up", 93f),
                    WordResult("at", "at", 97f),
                    WordResult("six", "six", 90f),
                    WordResult("o'clock", "o'clock", 78f),
                    WordResult("and", "and", 96f),
                    WordResult("have", "have", 94f),
                    WordResult("breakfast", "breakfast", 80f),
                    WordResult("at", "at", 97f),
                    WordResult("seven", "seven", 91f)
                )
            ),
            SentenceResult(
                text = "My favorite subject is English because I enjoy reading stories.",
                userText = "My favorite subject is English because I enjoy reading stories",
                score = (pron - 3 + Random.nextFloat() * 6).coerceIn(0f, 100f),
                words = listOf(
                    WordResult("My", "My", 96f),
                    WordResult("favorite", "favorite", 85f),
                    WordResult("subject", "subject", 88f),
                    WordResult("is", "is", 97f),
                    WordResult("English", "English", 92f),
                    WordResult("because", "because", 83f),
                    WordResult("I", "I", 98f),
                    WordResult("enjoy", "enjoy", 90f),
                    WordResult("reading", "reading", 87f),
                    WordResult("stories", "stories", 84f)
                )
            )
        )

        return EvaluationResult(
            id = UUID.randomUUID().toString(),
            sessionId = sessionId,
            exerciseId = exerciseId,
            totalScore = Math.round(total * 10) / 10f,
            pronunciationScore = Math.round(pron * 10) / 10f,
            fluencyScore = Math.round(fluency * 10) / 10f,
            contentScore = Math.round(content * 10) / 10f,
            duration = duration,
            feedback = feedback,
            details = mockSentences,
            audioFilePath = audioFilePath,
            createdAt = System.currentTimeMillis()
        )
    }

    private fun toEntity(result: EvaluationResult) = EvaluationEntity(
        id = result.id,
        sessionId = result.sessionId,
        exerciseId = result.exerciseId,
        totalScore = result.totalScore,
        pronunciationScore = result.pronunciationScore,
        fluencyScore = result.fluencyScore,
        contentScore = result.contentScore,
        duration = result.duration,
        feedback = result.feedback,
        details = result.details,
        audioFilePath = result.audioFilePath,
        createdAt = result.createdAt
    )

    private fun toDomain(entity: EvaluationEntity) = EvaluationResult(
        id = entity.id,
        sessionId = entity.sessionId,
        exerciseId = entity.exerciseId,
        totalScore = entity.totalScore,
        pronunciationScore = entity.pronunciationScore,
        fluencyScore = entity.fluencyScore,
        contentScore = entity.contentScore,
        duration = entity.duration,
        feedback = entity.feedback,
        details = entity.details,
        audioFilePath = entity.audioFilePath,
        createdAt = entity.createdAt
    )
}
