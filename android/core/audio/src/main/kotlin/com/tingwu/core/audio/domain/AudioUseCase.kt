package com.tingwu.core.audio.domain

import com.tingwu.core.audio.data.AudioEngine
import javax.inject.Inject

class AudioUseCase @Inject constructor(
    private val audioEngine: AudioEngine
) {
    suspend fun startRecording() = audioEngine.startRecording()
    suspend fun stopRecording() = audioEngine.stopRecording()
    suspend fun cancelRecording() = audioEngine.cancelRecording()
    suspend fun play(audioFile: AudioFile) = audioEngine.play(audioFile)
    suspend fun pause() = audioEngine.pause()
    suspend fun stop() = audioEngine.stop()
    fun onVolumeChange(callback: (volume: Int) -> Unit) = audioEngine.onVolumeChange(callback)
    fun onRecordingTimeChange(callback: (time: Long) -> Unit) = audioEngine.onRecordingTimeChange(callback)
    suspend fun compressAudio(inputFile: AudioFile) = audioEngine.compressAudio(inputFile)
}
