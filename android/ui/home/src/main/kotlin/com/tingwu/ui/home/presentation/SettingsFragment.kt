package com.tingwu.ui.home.presentation

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tingwu.core.auth.data.AuthRepository
import com.tingwu.ui.common.base.BaseFragment
import com.tingwu.ui.home.R
import com.tingwu.ui.home.databinding.FragmentSettingsBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import javax.inject.Inject

@AndroidEntryPoint
class SettingsFragment : BaseFragment<FragmentSettingsBinding>() {

    @Inject
    lateinit var authRepository: AuthRepository

    override fun createBinding(inflater: LayoutInflater, container: ViewGroup?): FragmentSettingsBinding =
        FragmentSettingsBinding.inflate(inflater, container, false)

    override fun setupUI() {
        // 退出登录
        binding.btnLogout.setOnClickListener {
            showLogoutConfirmDialog()
        }

        // 练习提醒开关
        binding.switchReminder.setOnCheckedChangeListener { _, isChecked ->
            val msg = if (isChecked) "已开启每日练习提醒" else "已关闭每日练习提醒"
            Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()
        }

        // 音效开关
        binding.switchSound.setOnCheckedChangeListener { _, isChecked ->
            val msg = if (isChecked) "已开启音效" else "已关闭音效"
            Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()
        }

        // 关于
        binding.itemAbout.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle("关于听悟")
                .setMessage("听悟 v1.0.0\n\n中考英语听说专项训练 App\n\n帮助中学生提升英语听力和口语表达能力。")
                .setPositiveButton("确定", null)
                .show()
        }

        // 用户反馈
        binding.itemFeedback.setOnClickListener {
            Toast.makeText(requireContext(), "感谢你的反馈！功能开发中...", Toast.LENGTH_SHORT).show()
        }

        // 清除缓存
        binding.itemClearCache.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle("清除缓存")
                .setMessage("确定要清除本地缓存吗？")
                .setPositiveButton("确定") { _, _ ->
                    Toast.makeText(requireContext(), "缓存已清除", Toast.LENGTH_SHORT).show()
                }
                .setNegativeButton("取消", null)
                .show()
        }
    }

    override fun setupObservers() {}

    private fun showLogoutConfirmDialog() {
        AlertDialog.Builder(requireContext())
            .setTitle("退出登录")
            .setMessage("确定要退出登录吗？")
            .setPositiveButton("退出") { _, _ ->
                performLogout()
            }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun performLogout() {
        CoroutineScope(Dispatchers.IO).launch {
            authRepository.logout()
            withContext(Dispatchers.Main) {
                // 导航回登录页
                findNavController().navigate(R.id.action_global_loginFragment)
            }
        }
    }
}
