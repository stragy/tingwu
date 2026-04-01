package com.tingwu.core.audio.impl

import android.content.Context
import android.net.Uri
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import com.tingwu.core.audio.domain.AudioPlayerUseCase
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Job
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ExoAudioPlayer @Inject constructor(
    @ApplicationContext private val context: Context
) : AudioPlayerUseCase {

    private var player: ExoPlayer? = null
    private var progressCallbacks = mutableListOf<(Long, Long) -> Unit>()
    private var completedCallbacks = mutableListOf<() -> Unit>()
    private var stateCallbacks = mutableListOf<(Boolean) -> Unit>()
    private var progressUpdateJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.Main)

    private val progressListener = object : Player.Listener {
        override fun onPlaybackStateChanged(playbackState: Int) {
            if (playbackState == Player.STATE_ENDED) {
                completedCallbacks.forEach { it() }
            }
        }

        override fun onIsPlayingChanged(isPlaying: Boolean) {
            stateCallbacks.forEach { it(isPlaying) }
            if (isPlaying) {
                startProgressUpdates()
            } else {
                stopProgressUpdates()
            }
        }
    }

    override fun initPlayer() {
        if (player != null) return
        player = ExoPlayer.Builder(context).build().apply {
            addListener(progressListener)
        }
    }

    override fun releasePlayer() {
        stopProgressUpdates()
        progressCallbacks.clear()
        completedCallbacks.clear()
        stateCallbacks.clear()
        player?.removeListener(progressListener)
        player?.release()
        player = null
    }

    override suspend fun loadAudio(source: String): Result<Unit> {
        return try {
            initPlayer()
            val uri = if (source.startsWith("http") || source.startsWith("content://")) {
                Uri.parse(source)
            } else {
                Uri.fromFile(File(source))
            }
            val mediaItem = MediaItem.fromUri(uri)
            player?.setMediaItem(mediaItem)
            player?.prepare()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun play() {
        player?.play()
    }

    override fun pause() {
        player?.pause()
    }

    override fun stop() {
        player?.stop()
        player?.seekTo(0)
    }

    override fun seekTo(positionMs: Long) {
        player?.seekTo(positionMs)
    }

    override fun getCurrentPosition(): Long {
        return player?.currentPosition?.coerceAtLeast(0L) ?: 0L
    }

    override fun getDuration(): Long {
        return player?.duration?.coerceAtLeast(0L) ?: 0L
    }

    override fun isPlaying(): Boolean {
        return player?.isPlaying == true
    }

    override fun setPlaybackSpeed(speed: Float) {
        player?.setPlaybackSpeed(speed.coerceIn(0.5f, 2.0f))
    }

    override fun getPlaybackSpeed(): Float {
        return player?.playbackParameters?.speed ?: 1.0f
    }

    override fun onProgressChanged(callback: (positionMs: Long, durationMs: Long) -> Unit) {
        progressCallbacks.add(callback)
    }

    override fun onPlaybackCompleted(callback: () -> Unit) {
        completedCallbacks.add(callback)
    }

    override fun onPlaybackStateChanged(callback: (Boolean) -> Unit) {
        stateCallbacks.add(callback)
    }

    private fun startProgressUpdates() {
        stopProgressUpdates()
        progressUpdateJob = scope.launch {
            while (true) {
                delay(200)
                val pos = getCurrentPosition()
                val dur = getDuration()
                if (dur > 0) {
                    progressCallbacks.forEach { it(pos, dur) }
                }
            }
        }
    }

    private fun stopProgressUpdates() {
        progressUpdateJob?.cancel()
        progressUpdateJob = null
    }
}
