package com.tingwu.core.evaluation.domain

/**
 * 练习评测结果
 */
data class EvaluationResult(
    val id: String,
    val sessionId: String,
    val exerciseId: String,
    val totalScore: Float,          // 总分 0-100
    val pronunciationScore: Float,  // 发音分 0-100
    val fluencyScore: Float,        // 流利度 0-100
    val contentScore: Float,        // 内容完整度 0-100
    val duration: Long,             // 录音时长（毫秒）
    val feedback: String,           // 总体评语
    val details: List<SentenceResult>, // 逐句评测
    val audioFilePath: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

data class SentenceResult(
    val text: String,               // 原文
    val userText: String,           // 用户识别结果
    val score: Float,               // 分数 0-100
    val words: List<WordResult>     // 逐词评测
)

data class WordResult(
    val word: String,               // 目标单词
    val userWord: String? = null,   // 用户发音识别结果
    val score: Float,               // 分数 0-100
    val status: String = "correct"  // correct / mispronounced / missing / extra
)
