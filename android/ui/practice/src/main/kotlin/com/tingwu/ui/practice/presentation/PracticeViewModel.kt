package com.tingwu.ui.practice.presentation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.tingwu.core.audio.domain.AudioUseCase
import com.tingwu.core.session.domain.SessionUseCase
import com.tingwu.core.session.domain.Session
import com.tingwu.core.evaluation.domain.EvaluationResult
import com.tingwu.core.evaluation.domain.EvaluationUseCase
import com.tingwu.ui.common.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PracticeViewModel @Inject constructor(
    private val sessionUseCase: SessionUseCase,
    private val audioUseCase: AudioUseCase,
    private val evaluationUseCase: EvaluationUseCase
) : BaseViewModel() {

    private val _currentSession = MutableLiveData<Session>()
    val currentSession: LiveData<Session> = _currentSession

    private val _recordingTime = MutableLiveData<Long>()
    val recordingTime: LiveData<Long> = _recordingTime

    private val _volume = MutableLiveData<Int>()
    val volume: LiveData<Int> = _volume

    private val _isRecording = MutableLiveData<Boolean>()
    val isRecording: LiveData<Boolean> = _isRecording

    /** 录音文件路径 */
    private var recordedAudioPath: String? = null

    /** 提交成功后的评测结果 */
    private val _evaluationResult = MutableLiveData<EvaluationResult?>()
    val evaluationResult: LiveData<EvaluationResult?> = _evaluationResult

    /** 提交完成事件（用于导航）*/
    private val _submitCompleted = MutableLiveData<EvaluationResult?>()
    val submitCompleted: LiveData<EvaluationResult?> = _submitCompleted

    fun startSession(exerciseId: String) {
        setLoading(true)
        viewModelScope.launch {
            sessionUseCase.createSession(exerciseId)
                .onSuccess { session ->
                    _currentSession.value = session
                    sessionUseCase.enableAutoSave(30000)
                    setLoading(false)
                }
                .onFailure { error ->
                    setError(error.message)
                    setLoading(false)
                }
        }
    }

    fun startRecording() {
        setLoading(true)
        viewModelScope.launch {
            audioUseCase.startRecording()
                .onSuccess {
                    _isRecording.value = true
                    audioUseCase.onRecordingTimeChange { time ->
                        _recordingTime.value = time
                    }
                    audioUseCase.onVolumeChange { vol ->
                        _volume.value = vol
                    }
                    setLoading(false)
                }
                .onFailure { error ->
                    setError(error.message)
                    setLoading(false)
                }
        }
    }

    fun stopRecording() {
        setLoading(true)
        viewModelScope.launch {
            audioUseCase.stopRecording()
                .onSuccess { path ->
                    _isRecording.value = false
                    recordedAudioPath = path.filePath
                    setLoading(false)
                }
                .onFailure { error ->
                    setError(error.message)
                    setLoading(false)
                }
        }
    }

    fun pauseSession() {
        viewModelScope.launch {
            sessionUseCase.pauseSession()
        }
    }

    fun resumeSession() {
        viewModelScope.launch {
            sessionUseCase.resumeSession()
        }
    }

    fun completeSession() {
        val session = _currentSession.value ?: return
        val audioPath = recordedAudioPath
        val duration = _recordingTime.value ?: 0L

        if (audioPath == null || duration < 1000) {
            setError("录音时长不足，请至少录制1秒")
            return
        }

        setLoading(true)
        viewModelScope.launch {
            // 完成会话
            sessionUseCase.completeSession(session).onFailure { error ->
                setError(error.message)
                setLoading(false)
                return@launch
            }

            // 提交评测
            evaluationUseCase.submitEvaluation(
                sessionId = session.id,
                exerciseId = session.exerciseId,
                audioFilePath = audioPath,
                duration = duration
            ).onSuccess { result ->
                _evaluationResult.value = result
                _submitCompleted.value = result
                setLoading(false)
            }.onFailure { error ->
                setError(error.message)
                setLoading(false)
            }
        }
    }

    /** 消费导航事件 */
    fun onNavigatedToResult() {
        _submitCompleted.value = null
    }
}
