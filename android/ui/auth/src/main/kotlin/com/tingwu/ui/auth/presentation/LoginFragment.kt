package com.tingwu.ui.auth.presentation

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tingwu.ui.auth.R
import com.tingwu.ui.auth.databinding.FragmentLoginBinding
import com.tingwu.ui.common.base.BaseFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginFragment : BaseFragment<FragmentLoginBinding>() {

    private val viewModel: LoginViewModel by viewModels()

    override fun createBinding(inflater: LayoutInflater, container: ViewGroup?): FragmentLoginBinding {
        return FragmentLoginBinding.inflate(inflater, container, false)
    }

    override fun setupUI() {
        // 手机号输入监听 — 有内容才允许点击"发送验证码"
        binding.etPhone.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                binding.btnSendCode.isEnabled = s?.length == 11
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        // 发送验证码
        binding.btnSendCode.setOnClickListener {
            val phone = binding.etPhone.text.toString().trim()
            if (phone.length != 11) {
                binding.tilPhone.error = getString(R.string.error_invalid_phone)
                return@setOnClickListener
            }
            binding.tilPhone.error = null
            viewModel.requestSmsCode(phone)
        }

        // 登录
        binding.btnLogin.setOnClickListener {
            val phone = binding.etPhone.text.toString().trim()
            val code = binding.etCode.text.toString().trim()
            if (phone.isEmpty() || code.length != 6) {
                binding.tilCode.error = getString(R.string.error_invalid_code)
                return@setOnClickListener
            }
            binding.tilCode.error = null
            viewModel.verifySmsCode(phone, code)
        }
    }

    override fun setupObservers() {
        // 加载状态
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnLogin.isEnabled = !isLoading
            binding.btnSendCode.isEnabled = !isLoading
        }

        // 验证码已发送 — 启动倒计时并显示验证码输入区
        viewModel.smsCodeSent.observe(viewLifecycleOwner) { sent ->
            if (sent == true) {
                binding.layoutCodeInput.visibility = View.VISIBLE
                binding.btnLogin.visibility = View.VISIBLE
                Toast.makeText(requireContext(), R.string.sms_sent, Toast.LENGTH_SHORT).show()
            }
        }

        // 倒计时显示在"发送验证码"按钮上
        viewModel.countdownTime.observe(viewLifecycleOwner) { seconds ->
            if (seconds > 0) {
                binding.btnSendCode.isEnabled = false
                binding.btnSendCode.text = getString(R.string.resend_countdown, seconds)
            } else {
                binding.btnSendCode.isEnabled = true
                binding.btnSendCode.text = getString(R.string.send_code)
            }
        }

        // 登录成功 — 跳转到练习页
        viewModel.loginSuccess.observe(viewLifecycleOwner) { success ->
            if (success == true) {
                findNavController().navigate(R.id.action_loginFragment_to_practiceFragment)
            }
        }

        // 错误提示
        viewModel.error.observe(viewLifecycleOwner) { message ->
            message?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show()
            }
        }
    }
}
