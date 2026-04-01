package com.tingwu.core.audio.domain

/**
 * 音频播放用例 — 基于 ExoPlayer 封装
 */
interface AudioPlayerUseCase {
    /** 初始化播放器 */
    fun initPlayer()

    /** 释放播放器 */
    fun releasePlayer()

    /** 加载音频文件（本地路径或 URL）*/
    suspend fun loadAudio(source: String): Result<Unit>

    /** 播放 */
    fun play()

    /** 暂停 */
    fun pause()

    /** 停止并重置到开头 */
    fun stop()

    /** 跳转到指定位置（毫秒）*/
    fun seekTo(positionMs: Long)

    /** 获取当前播放位置（毫秒）*/
    fun getCurrentPosition(): Long

    /** 获取总时长（毫秒）*/
    fun getDuration(): Long

    /** 是否正在播放 */
    fun isPlaying(): Boolean

    /** 设置播放速度 0.5x ~ 2.0x */
    fun setPlaybackSpeed(speed: Float)

    /** 获取当前播放速度 */
    fun getPlaybackSpeed(): Float

    /** 注册播放进度监听 */
    fun onProgressChanged(callback: (positionMs: Long, durationMs: Long) -> Unit)

    /** 注册播放完成监听 */
    fun onPlaybackCompleted(callback: () -> Unit)

    /** 注册播放状态监听 */
    fun onPlaybackStateChanged(callback: (isPlaying: Boolean) -> Unit)
}
