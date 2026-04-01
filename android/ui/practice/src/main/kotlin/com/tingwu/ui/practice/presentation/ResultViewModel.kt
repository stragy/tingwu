package com.tingwu.ui.practice.presentation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.viewModelScope
import com.tingwu.core.evaluation.domain.EvaluationResult
import com.tingwu.core.evaluation.domain.EvaluationUseCase
import com.tingwu.ui.common.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ResultViewModel @Inject constructor(
    private val evaluationUseCase: EvaluationUseCase,
    savedStateHandle: SavedStateHandle
) : BaseViewModel() {

    /** 导航参数：evaluationId 由 PracticeFragment 通过 Safe Args 传入 */
    private val evaluationId: String? = savedStateHandle["evaluationId"]

    private val _evaluationResult = MutableLiveData<EvaluationResult?>()
    val evaluationResult: LiveData<EvaluationResult?> = _evaluationResult

    init {
        loadResult()
    }

    fun loadResult() {
        val id = evaluationId ?: return
        setLoading(true)
        viewModelScope.launch {
            evaluationUseCase.getEvaluation(id)
                .onSuccess { result ->
                    _evaluationResult.value = result
                    setLoading(false)
                }
                .onFailure { error ->
                    setError(error.message)
                    setLoading(false)
                }
        }
    }
}
