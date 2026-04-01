package com.tingwu.core.audio.impl

import android.content.Context
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Build
import com.tingwu.core.audio.data.AudioEngine
import com.tingwu.core.audio.domain.AudioFile
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

/**
 * MediaRecorderAudioEngine
 *
 * 使用 Android MediaRecorder 实现真实录音。
 * - 音量（maxAmplitude）以 100ms 间隔轮询，归一化到 0-100
 * - 录音时长以 100ms 为步进递增
 * - 录制输出格式：AAC/MP4（兼容 API 24+）
 */
@Singleton
class MediaRecorderAudioEngine @Inject constructor(
    @ApplicationContext private val context: Context
) : AudioEngine {

    private var recorder: MediaRecorder? = null
    private var player: MediaPlayer? = null

    private var currentOutputFile: File? = null
    private var recordingStartTime: Long = 0L

    private var volumeCallback: ((Int) -> Unit)? = null
    private var timeCallback: ((Long) -> Unit)? = null

    private var pollingJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.IO)

    // ──────────────────────────────────────────────────────────────
    // Recording
    // ──────────────────────────────────────────────────────────────

    override suspend fun startRecording(): Result<Unit> {
        return try {
            stopPolling()
            recorder?.release()

            // 创建输出文件到应用 cache 目录
            val outputDir = File(context.cacheDir, "recordings").also { it.mkdirs() }
            val outputFile = File(outputDir, "rec_${System.currentTimeMillis()}.m4a")
            currentOutputFile = outputFile

            recorder = createMediaRecorder().apply {
                setAudioSource(MediaRecorder.AudioSource.MIC)
                setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                setAudioEncodingBitRate(128_000)
                setAudioSamplingRate(44_100)
                setOutputFile(outputFile.absolutePath)
                prepare()
                start()
            }

            recordingStartTime = System.currentTimeMillis()
            startPolling()

            Result.success(Unit)
        } catch (e: Exception) {
            recorder?.release()
            recorder = null
            Result.failure(Exception("录音启动失败：${e.message}", e))
        }
    }

    override suspend fun stopRecording(): Result<AudioFile> {
        return try {
            stopPolling()

            val rec = recorder ?: return Result.failure(Exception("当前没有正在进行的录音"))
            rec.stop()
            rec.release()
            recorder = null

            val file = currentOutputFile
                ?: return Result.failure(Exception("录音文件不存在"))

            val duration = System.currentTimeMillis() - recordingStartTime
            val audioFile = AudioFile(
                id = UUID.randomUUID().toString(),
                filePath = file.absolutePath,
                duration = duration,
                fileSize = file.length(),
                format = "m4a",
                createdAt = System.currentTimeMillis()
            )
            Result.success(audioFile)
        } catch (e: Exception) {
            recorder?.release()
            recorder = null
            Result.failure(Exception("停止录音失败：${e.message}", e))
        }
    }

    override suspend fun cancelRecording(): Result<Unit> {
        return try {
            stopPolling()
            recorder?.apply {
                stop()
                release()
            }
            recorder = null
            currentOutputFile?.delete()
            currentOutputFile = null
            Result.success(Unit)
        } catch (e: Exception) {
            recorder?.release()
            recorder = null
            Result.failure(Exception("取消录音失败：${e.message}", e))
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Playback
    // ──────────────────────────────────────────────────────────────

    override suspend fun play(audioFile: AudioFile): Result<Unit> {
        return try {
            player?.release()
            player = MediaPlayer().apply {
                setDataSource(audioFile.filePath)
                prepare()
                start()
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("播放失败：${e.message}", e))
        }
    }

    override suspend fun pause(): Result<Unit> {
        return try {
            player?.pause()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("暂停失败：${e.message}", e))
        }
    }

    override suspend fun stop(): Result<Unit> {
        return try {
            player?.apply {
                stop()
                release()
            }
            player = null
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(Exception("停止播放失败：${e.message}", e))
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Callbacks
    // ──────────────────────────────────────────────────────────────

    override fun onVolumeChange(callback: (volume: Int) -> Unit) {
        volumeCallback = callback
    }

    override fun onRecordingTimeChange(callback: (time: Long) -> Unit) {
        timeCallback = callback
    }

    // ──────────────────────────────────────────────────────────────
    // Compression（使用 MediaRecorder 直接输出 AAC，不需要二次压缩）
    // ──────────────────────────────────────────────────────────────

    override suspend fun compressAudio(inputFile: AudioFile): Result<AudioFile> {
        // AAC/M4A 已经是高压缩格式，直接返回原文件
        return Result.success(inputFile)
    }

    // ──────────────────────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────────────────────

    private fun startPolling() {
        pollingJob = scope.launch {
            while (true) {
                delay(100)
                val rec = recorder ?: break

                // 录音时长（毫秒）
                val elapsed = System.currentTimeMillis() - recordingStartTime
                timeCallback?.invoke(elapsed)

                // 音量归一化：maxAmplitude 范围 0~32767，映射到 0~100
                val amplitude = try { rec.maxAmplitude } catch (e: Exception) { 0 }
                val volume = (amplitude / 327.67f).toInt().coerceIn(0, 100)
                volumeCallback?.invoke(volume)
            }
        }
    }

    private fun stopPolling() {
        pollingJob?.cancel()
        pollingJob = null
    }

    @Suppress("DEPRECATION")
    private fun createMediaRecorder(): MediaRecorder {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(context)
        } else {
            MediaRecorder()
        }
    }
}
