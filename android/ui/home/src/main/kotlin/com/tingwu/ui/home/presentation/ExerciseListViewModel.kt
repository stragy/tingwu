package com.tingwu.ui.home.presentation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tingwu.core.network.data.ExerciseItem
import com.tingwu.core.network.data.ExerciseRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExerciseListViewModel @Inject constructor(
    private val exerciseRepository: ExerciseRepository
) : ViewModel() {

    private val _exercises = MutableLiveData<List<ExerciseItem>>()
    val exercises: LiveData<List<ExerciseItem>> = _exercises

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private val _isEmpty = MutableLiveData<Boolean>()
    val isEmpty: LiveData<Boolean> = _isEmpty

    private var currentType: String? = null
    private var currentDifficulty: String? = null
    private var currentPage = 1
    private var isLastPage = false
    private val allItems = mutableListOf<ExerciseItem>()

    init {
        loadExercises(refresh = true)
    }

    fun loadExercises(
        type: String? = currentType,
        difficulty: String? = currentDifficulty,
        refresh: Boolean = false
    ) {
        if (_loading.value == true) return
        if (!refresh && isLastPage) return

        if (refresh) {
            currentPage = 1
            isLastPage = false
            allItems.clear()
        }

        currentType = type
        currentDifficulty = difficulty

        viewModelScope.launch {
            _loading.postValue(true)
            _error.postValue(null)
            exerciseRepository.getExercises(
                type = type,
                difficulty = difficulty,
                page = currentPage,
                pageSize = 20
            ).onSuccess { response ->
                val newItems = response.items
                allItems.addAll(newItems)
                _exercises.postValue(allItems.toList())
                _isEmpty.postValue(allItems.isEmpty())
                if (newItems.size < 20) isLastPage = true
                currentPage++
            }.onFailure { e ->
                _error.postValue(e.message ?: "加载失败")
                _isEmpty.postValue(allItems.isEmpty())
            }
            _loading.postValue(false)
        }
    }

    fun refresh() = loadExercises(refresh = true)

    fun filterByType(type: String?) = loadExercises(type = type, refresh = true)

    fun filterByDifficulty(difficulty: String?) = loadExercises(difficulty = difficulty, refresh = true)

    fun clearError() {
        _error.value = null
    }
}
