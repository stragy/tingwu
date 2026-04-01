package com.tingwu.ui.auth.presentation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.tingwu.core.auth.domain.AuthUseCase
import com.tingwu.ui.common.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authUseCase: AuthUseCase
) : BaseViewModel() {

    private val _smsCodeSent = MutableLiveData<Boolean>()
    val smsCodeSent: LiveData<Boolean> = _smsCodeSent

    private val _loginSuccess = MutableLiveData<Boolean>()
    val loginSuccess: LiveData<Boolean> = _loginSuccess

    private val _countdownTime = MutableLiveData<Int>()
    val countdownTime: LiveData<Int> = _countdownTime

    fun requestSmsCode(phoneNumber: String) {
        setLoading(true)
        viewModelScope.launch {
            authUseCase.requestSmsCode(phoneNumber)
                .onSuccess {
                    _smsCodeSent.value = true
                    startCountdown()
                    setLoading(false)
                }
                .onFailure { error ->
                    setError(error.message)
                    setLoading(false)
                }
        }
    }

    fun verifySmsCode(phoneNumber: String, code: String) {
        setLoading(true)
        viewModelScope.launch {
            authUseCase.verifySmsCode(phoneNumber, code)
                .onSuccess {
                    _loginSuccess.value = true
                    setLoading(false)
                }
                .onFailure { error ->
                    setError(error.message)
                    setLoading(false)
                }
        }
    }

    private fun startCountdown() {
        var time = 60
        _countdownTime.value = time
        viewModelScope.launch {
            while (time > 0) {
                kotlinx.coroutines.delay(1000)
                time--
                _countdownTime.value = time
            }
        }
    }
}
