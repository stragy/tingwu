package com.tingwu.core.audio.domain

data class AudioFile(
    val id: String,
    val filePath: String,
    val duration: Long,
    val fileSize: Long,
    val format: String = "mp3",
    val createdAt: Long
)
