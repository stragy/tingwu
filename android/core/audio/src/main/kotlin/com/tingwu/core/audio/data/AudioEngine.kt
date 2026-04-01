package com.tingwu.core.audio.data

import com.tingwu.core.audio.domain.AudioFile

interface AudioEngine {
    suspend fun startRecording(): Result<Unit>
    suspend fun stopRecording(): Result<AudioFile>
    suspend fun cancelRecording(): Result<Unit>
    suspend fun play(audioFile: AudioFile): Result<Unit>
    suspend fun pause(): Result<Unit>
    suspend fun stop(): Result<Unit>
    fun onVolumeChange(callback: (volume: Int) -> Unit)
    fun onRecordingTimeChange(callback: (time: Long) -> Unit)
    suspend fun compressAudio(inputFile: AudioFile): Result<AudioFile>
}
