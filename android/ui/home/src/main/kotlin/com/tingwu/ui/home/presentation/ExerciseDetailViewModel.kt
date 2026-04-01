package com.tingwu.ui.home.presentation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tingwu.core.network.data.ExerciseDetailResponse
import com.tingwu.core.network.data.ExerciseRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExerciseDetailViewModel @Inject constructor(
    private val exerciseRepository: ExerciseRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val exerciseId: String = savedStateHandle.get<String>("exerciseId") ?: ""

    private val _exercise = MutableLiveData<ExerciseDetailResponse?>()
    val exercise: LiveData<ExerciseDetailResponse?> = _exercise

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        if (exerciseId.isNotBlank()) {
            loadExerciseDetail(exerciseId)
        }
    }

    fun loadExerciseDetail(id: String) {
        viewModelScope.launch {
            _loading.postValue(true)
            _error.postValue(null)
            exerciseRepository.getExerciseDetail(id)
                .onSuccess { detail ->
                    _exercise.postValue(detail)
                }
                .onFailure { e ->
                    _error.postValue(e.message ?: "加载题目详情失败")
                }
            _loading.postValue(false)
        }
    }

    fun clearError() {
        _error.value = null
    }
}
