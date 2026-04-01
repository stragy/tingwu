package com.tingwu.ui.practice.presentation

import android.content.Intent
import android.graphics.Color
import android.media.MediaPlayer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tingwu.core.evaluation.domain.EvaluationResult
import com.tingwu.core.evaluation.domain.SentenceResult
import com.tingwu.ui.practice.R
import com.tingwu.ui.practice.databinding.FragmentResultBinding
import com.tingwu.ui.common.base.BaseFragment
import dagger.hilt.android.AndroidEntryPoint
import java.io.File
import java.io.IOException

@AndroidEntryPoint
class ResultFragment : BaseFragment<FragmentResultBinding>() {

    private val viewModel: ResultViewModel by viewModels()

    private var mediaPlayer: MediaPlayer? = null
    private var isPlaying = false

    override fun createBinding(inflater: LayoutInflater, container: ViewGroup?): FragmentResultBinding {
        return FragmentResultBinding.inflate(inflater, container, false)
    }

    override fun setupUI() {
        // 重听录音按钮
        binding.btnPlayRecording.setOnClickListener {
            val result = viewModel.evaluationResult.value
            val audioPath = result?.audioFilePath
            if (audioPath != null && File(audioPath).exists()) {
                togglePlayback(audioPath)
            } else {
                Toast.makeText(requireContext(), "录音文件不存在", Toast.LENGTH_SHORT).show()
            }
        }

        // 再练一次
        binding.btnPracticeAgain.setOnClickListener {
            stopPlayback()
            findNavController().popBackStack()
        }
    }

    override fun setupObservers() {
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.evaluationResult.observe(viewLifecycleOwner) { result ->
            result?.let { bindResult(it) }
        }

        viewModel.error.observe(viewLifecycleOwner) { message ->
            message?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun bindResult(result: EvaluationResult) {
        // 总分（保留一位小数）
        binding.tvTotalScore.text = String.format("%.1f", result.totalScore)

        // 根据分数动态改变颜色
        binding.tvTotalScore.setTextColor(scoreColor(result.totalScore))

        // 评语
        binding.tvFeedback.text = result.feedback

        // 三维度分数
        binding.tvPronunciationScore.text = String.format("%.0f", result.pronunciationScore)
        binding.tvFluencyScore.text = String.format("%.0f", result.fluencyScore)
        binding.tvContentScore.text = String.format("%.0f", result.contentScore)

        // 录音时长
        val totalSecs = result.duration / 1000
        binding.tvDuration.text = getString(
            R.string.result_duration,
            getString(R.string.result_duration_format, totalSecs / 60, totalSecs % 60)
        )

        // 逐句详情
        binding.layoutSentenceDetails.removeAllViews()
        result.details.forEachIndexed { index, sentence ->
            val sentenceView = buildSentenceView(index + 1, sentence)
            binding.layoutSentenceDetails.addView(sentenceView)
        }

        // 如果有录音文件，激活播放按钮
        if (result.audioFilePath != null && File(result.audioFilePath).exists()) {
            binding.btnPlayRecording.isEnabled = true
        } else {
            binding.btnPlayRecording.isEnabled = false
        }
    }

    /**
     * 动态构建每句话的评测卡片视图。
     * 布局：序号 + 原文 + 用户识别文本 + 分数 + 逐词状态
     */
    private fun buildSentenceView(index: Int, sentence: SentenceResult): View {
        val ctx = requireContext()
        val dp8 = (8 * resources.displayMetrics.density).toInt()
        val dp12 = (12 * resources.displayMetrics.density).toInt()
        val dp16 = (16 * resources.displayMetrics.density).toInt()

        // 外层卡片容器
        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp16, dp12, dp16, dp12)
            setBackgroundColor(Color.WHITE)
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            lp.bottomMargin = dp8
            layoutParams = lp
        }

        // 标题行：第 N 句 / 分数
        val headerRow = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        val tvIndex = TextView(ctx).apply {
            text = "第${index}句"
            textSize = 13f
            setTextColor(Color.parseColor("#888888"))
            layoutParams = LinearLayout.LayoutParams(
                0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f
            )
        }
        val tvScore = TextView(ctx).apply {
            text = String.format("%.0f分", sentence.score)
            textSize = 14f
            setTextColor(scoreColor(sentence.score))
        }
        headerRow.addView(tvIndex)
        headerRow.addView(tvScore)
        container.addView(headerRow)

        // 原文
        val tvOriginal = TextView(ctx).apply {
            text = sentence.text
            textSize = 14f
            setTextColor(Color.parseColor("#333333"))
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            lp.topMargin = dp8
            layoutParams = lp
        }
        container.addView(tvOriginal)

        // 用户识别结果
        if (sentence.userText.isNotBlank()) {
            val tvUser = TextView(ctx).apply {
                text = "你说：${sentence.userText}"
                textSize = 13f
                setTextColor(Color.parseColor("#666666"))
                val lp = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
                lp.topMargin = (4 * resources.displayMetrics.density).toInt()
                layoutParams = lp
            }
            container.addView(tvUser)
        }

        // 逐词状态行（横向流式布局用 LinearLayout 水平+换行模拟）
        if (sentence.words.isNotEmpty()) {
            val wordsRow = LinearLayout(ctx).apply {
                orientation = LinearLayout.HORIZONTAL
                val lp = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
                lp.topMargin = dp8
                layoutParams = lp
            }
            sentence.words.forEach { word ->
                val wordColor = when {
                    word.score >= 80f -> Color.parseColor("#388E3C")   // 绿
                    word.score >= 60f -> Color.parseColor("#F57C00")   // 橙
                    else -> Color.parseColor("#D32F2F")                 // 红
                }
                val tvWord = TextView(ctx).apply {
                    text = word.word
                    textSize = 13f
                    setTextColor(wordColor)
                    val lp = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                    )
                    lp.marginEnd = (6 * resources.displayMetrics.density).toInt()
                    layoutParams = lp
                }
                wordsRow.addView(tvWord)
            }
            container.addView(wordsRow)
        }

        // 分割线
        val divider = View(ctx).apply {
            setBackgroundColor(Color.parseColor("#EEEEEE"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                (1 * resources.displayMetrics.density).toInt()
            ).also { it.topMargin = dp8 }
        }
        container.addView(divider)

        return container
    }

    /** 根据分数返回对应颜色：高分蓝，中分橙，低分红 */
    private fun scoreColor(score: Float): Int {
        return when {
            score >= 80f -> Color.parseColor("#1976D2")
            score >= 60f -> Color.parseColor("#F57C00")
            else -> Color.parseColor("#D32F2F")
        }
    }

    // ---- 音频播放 ----

    private fun togglePlayback(audioPath: String) {
        if (isPlaying) {
            stopPlayback()
            binding.btnPlayRecording.text = getString(R.string.result_play_recording)
        } else {
            startPlayback(audioPath)
        }
    }

    private fun startPlayback(audioPath: String) {
        stopPlayback()
        try {
            mediaPlayer = MediaPlayer().apply {
                setDataSource(audioPath)
                prepare()
                start()
                setOnCompletionListener {
                    this@ResultFragment.isPlaying = false
                    binding.btnPlayRecording.text = getString(R.string.result_play_recording)
                    release()
                    mediaPlayer = null
                }
            }
            isPlaying = true
            binding.btnPlayRecording.text = "停止播放"
        } catch (e: IOException) {
            Toast.makeText(requireContext(), "无法播放录音", Toast.LENGTH_SHORT).show()
        }
    }

    private fun stopPlayback() {
        mediaPlayer?.let {
            if (it.isPlaying) it.stop()
            it.release()
        }
        mediaPlayer = null
        isPlaying = false
    }

    override fun onDestroyView() {
        stopPlayback()
        super.onDestroyView()
    }
}
