package com.tingwu.ui.practice.presentation

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.os.bundleOf
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tingwu.ui.practice.R
import com.tingwu.ui.practice.databinding.FragmentPracticeBinding
import com.tingwu.ui.common.base.BaseFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class PracticeFragment : BaseFragment<FragmentPracticeBinding>() {

    private val viewModel: PracticeViewModel by viewModels()

    private val requestAudioPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            viewModel.startRecording()
        } else {
            Toast.makeText(requireContext(), R.string.permission_audio_denied, Toast.LENGTH_LONG).show()
        }
    }

    override fun createBinding(inflater: LayoutInflater, container: ViewGroup?): FragmentPracticeBinding {
        return FragmentPracticeBinding.inflate(inflater, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // 优先从导航参数读取 exerciseId；无参数时回退 demo 题目
        val exerciseId = arguments?.getString("exerciseId") ?: "exercise_demo_001"
        val exerciseTitle = arguments?.getString("exerciseTitle") ?: ""
        val exerciseInstructions = arguments?.getString("exerciseInstructions") ?: ""
        val exerciseSentences = arguments?.getStringArray("exerciseSentences")
        val exerciseSentencesCn = arguments?.getStringArray("exerciseSentencesCn")

        // 显示题目信息（如果有传入）
        if (exerciseTitle.isNotBlank() || exerciseInstructions.isNotBlank()) {
            binding.cardExerciseInfo.visibility = View.VISIBLE
            binding.tvExerciseTitle.text = exerciseTitle.ifBlank { "练习" }
            binding.tvExerciseInstructions.text = exerciseInstructions.ifBlank { "请开始录音练习。" }
        }

        // 显示句子列表（如果有）
        if (!exerciseSentences.isNullOrEmpty()) {
            binding.cardContent.visibility = View.VISIBLE
            binding.contentSentenceContainer.removeAllViews()
            exerciseSentences.forEachIndexed { idx, sentence ->
                val itemView = LayoutInflater.from(requireContext())
                    .inflate(android.R.layout.simple_list_item_2, binding.contentSentenceContainer, false)
                itemView.findViewById<TextView>(android.R.id.text1).apply {
                    text = "${idx + 1}. $sentence"
                    textSize = 14f
                    setTextColor(0xFF333333.toInt())
                }
                val cn = exerciseSentencesCn?.getOrNull(idx)
                itemView.findViewById<TextView>(android.R.id.text2).apply {
                    if (!cn.isNullOrBlank()) {
                        text = cn
                        visibility = View.VISIBLE
                    } else {
                        visibility = View.GONE
                    }
                }
                binding.contentSentenceContainer.addView(itemView)
            }
        }

        viewModel.startSession(exerciseId)
    }

    override fun setupUI() {
        binding.btnRecord.setOnClickListener {
            if (viewModel.isRecording.value == true) {
                viewModel.stopRecording()
            } else {
                checkAudioPermissionAndRecord()
            }
        }

        binding.btnPause.setOnClickListener {
            viewModel.pauseSession()
            binding.btnPause.isEnabled = false
            binding.btnResume.isEnabled = true
        }

        binding.btnResume.setOnClickListener {
            viewModel.resumeSession()
            binding.btnResume.isEnabled = false
            binding.btnPause.isEnabled = true
        }

        binding.btnSubmit.setOnClickListener {
            viewModel.completeSession()
        }
    }

    override fun setupObservers() {
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.currentSession.observe(viewLifecycleOwner) { session ->
            session?.let {
                binding.tvSessionId.text = getString(R.string.session_label, it.id.take(8))
                binding.tvStatus.text = getString(R.string.status_label, it.status)
                binding.btnRecord.isEnabled = true
                binding.btnPause.isEnabled = true
                binding.btnSubmit.isEnabled = true
            }
        }

        viewModel.isRecording.observe(viewLifecycleOwner) { isRecording ->
            if (isRecording == true) {
                binding.btnRecord.text = getString(R.string.stop_recording)
                binding.recordingIndicator.visibility = View.VISIBLE
            } else {
                binding.btnRecord.text = getString(R.string.start_recording)
                binding.recordingIndicator.visibility = View.GONE
            }
        }

        viewModel.recordingTime.observe(viewLifecycleOwner) { timeMs ->
            val seconds = (timeMs ?: 0L) / 1000
            binding.tvRecordingTime.text = getString(R.string.recording_time_format, seconds / 60, seconds % 60)
        }

        viewModel.volume.observe(viewLifecycleOwner) { volume ->
            binding.volumeBar.progress = volume ?: 0
        }

        // 提交成功 → 导航到结果页，使用 Bundle 方式传递参数（避免跨模块 Safe Args 依赖）
        viewModel.submitCompleted.observe(viewLifecycleOwner) { result ->
            result?.let {
                viewModel.onNavigatedToResult()
                val args = bundleOf(
                    "evaluationId" to it.id,
                    "sessionId" to it.sessionId
                )
                findNavController().navigate(R.id.action_practiceFragment_to_resultFragment, args)
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { message ->
            message?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun checkAudioPermissionAndRecord() {
        when {
            ContextCompat.checkSelfPermission(
                requireContext(), Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED -> {
                viewModel.startRecording()
            }
            shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO) -> {
                Toast.makeText(requireContext(), R.string.permission_audio_rationale, Toast.LENGTH_LONG).show()
                requestAudioPermission.launch(Manifest.permission.RECORD_AUDIO)
            }
            else -> {
                requestAudioPermission.launch(Manifest.permission.RECORD_AUDIO)
            }
        }
    }
}


