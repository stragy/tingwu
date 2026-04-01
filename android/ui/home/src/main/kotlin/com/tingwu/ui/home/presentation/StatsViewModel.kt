package com.tingwu.ui.home.presentation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tingwu.core.evaluation.data.EvaluationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class StatsViewModel @Inject constructor(
    private val evaluationRepository: EvaluationRepository
) : ViewModel() {

    private val _statistics = MutableLiveData<StatisticsUiState?>()
    val statistics: LiveData<StatisticsUiState?> = _statistics

    private val _history = MutableLiveData<List<HistoryItem>>()
    val history: LiveData<List<HistoryItem>> = _history

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        loadStatistics()
        loadHistory()
    }

    fun loadStatistics() {
        viewModelScope.launch {
            _loading.postValue(true)
            try {
                evaluationRepository.getStatistics()
                    .onSuccess { stats ->
                        _statistics.postValue(
                            StatisticsUiState(
                                totalPractices = stats.totalPractices,
                                averageScore = stats.averageScore,
                                bestScore = stats.bestScore,
                                streakDays = stats.streakDays,
                                totalDurationMinutes = (stats.totalDurationMs / 60000).toInt(),
                                averagePronunciation = stats.averagePronunciation,
                                averageFluency = stats.averageFluency,
                                averageContent = stats.averageContent
                            )
                        )
                    }
                    .onFailure { _error.postValue(it.message) }
            } catch (e: Exception) {
                _error.postValue(e.message ?: "加载统计失败")
            }
            _loading.postValue(false)
        }
    }

    fun loadHistory() {
        viewModelScope.launch {
            try {
                evaluationRepository.getHistory(offset = 0, limit = 50)
                    .onSuccess { list ->
                        _history.postValue(list.map { record ->
                            HistoryItem(
                                id = record.id,
                                exerciseTitle = record.exerciseId,
                                score = record.totalScore,
                                date = record.createdAt,
                                type = record.exerciseId
                            )
                        })
                    }
                    .onFailure { _error.postValue(it.message) }
            } catch (e: Exception) {
                _error.postValue(e.message)
            }
        }
    }

    fun refresh() {
        loadStatistics()
        loadHistory()
    }

    fun clearError() { _error.value = null }
}

data class StatisticsUiState(
    val totalPractices: Int,
    val averageScore: Float,
    val bestScore: Float,
    val streakDays: Int,
    val totalDurationMinutes: Int,
    val averagePronunciation: Float,
    val averageFluency: Float,
    val averageContent: Float
)

data class HistoryItem(
    val id: String,
    val exerciseTitle: String,
    val score: Float,
    val date: Long,
    val type: String
)
