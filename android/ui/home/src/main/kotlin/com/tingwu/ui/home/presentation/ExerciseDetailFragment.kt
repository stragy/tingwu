package com.tingwu.ui.home.presentation

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.os.bundleOf
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.tingwu.core.network.data.ExerciseSentence
import com.tingwu.ui.common.base.BaseFragment
import com.tingwu.ui.home.R
import com.tingwu.ui.home.databinding.FragmentExerciseDetailBinding
import com.tingwu.ui.home.databinding.ItemSentenceBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ExerciseDetailFragment : BaseFragment<FragmentExerciseDetailBinding>() {

    private val viewModel: ExerciseDetailViewModel by viewModels()

    override fun createBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ): FragmentExerciseDetailBinding =
        FragmentExerciseDetailBinding.inflate(inflater, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val exerciseId = arguments?.getString("exerciseId") ?: ""
        val exerciseTitle = arguments?.getString("exerciseTitle") ?: "练习"
        binding.tvExerciseTitle.text = exerciseTitle
        if (exerciseId.isNotBlank()) viewModel.loadExerciseDetail(exerciseId)
    }

    override fun setupUI() {
        binding.btnStartPractice.setOnClickListener {
            val detail = viewModel.exercise.value ?: return@setOnClickListener
            val sentences = detail.content.sentences.map { it.text }.toTypedArray()
            val sentencesCn = detail.content.sentences.map { it.translation ?: "" }.toTypedArray()
            val args = bundleOf(
                "exerciseId" to detail.id,
                "exerciseTitle" to detail.title,
                "exerciseInstructions" to detail.content.instructions,
                "exerciseSentences" to sentences,
                "exerciseSentencesCn" to sentencesCn
            )
            findNavController().navigate(R.id.action_exerciseDetailFragment_to_practiceFragment, args)
        }

        binding.btnRetry.setOnClickListener {
            val exerciseId = arguments?.getString("exerciseId") ?: return@setOnClickListener
            viewModel.loadExerciseDetail(exerciseId)
        }
    }

    override fun setupObservers() {
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.contentLayout.visibility = if (isLoading) View.GONE else View.VISIBLE
        }

        viewModel.exercise.observe(viewLifecycleOwner) { detail ->
            detail ?: return@observe
            binding.layoutError.visibility = View.GONE
            binding.contentLayout.visibility = View.VISIBLE

            binding.tvExerciseTitle.text = detail.title
            binding.tvType.text = getTypeLabel(detail.type)
            binding.tvDifficulty.text = getDifficultyLabel(detail.difficulty)
            binding.tvInstructions.text = detail.content.instructions

            // 构建句子列表
            binding.sentenceContainer.removeAllViews()
            detail.content.sentences.forEachIndexed { idx, sentence ->
                addSentenceView(idx + 1, sentence)
            }

            binding.btnStartPractice.isEnabled = true
        }

        viewModel.error.observe(viewLifecycleOwner) { msg ->
            msg?.let {
                binding.layoutError.visibility = View.VISIBLE
                binding.tvError.text = it
                binding.contentLayout.visibility = View.GONE
                viewModel.clearError()
            }
        }
    }

    private fun addSentenceView(index: Int, sentence: ExerciseSentence) {
        val inflater = LayoutInflater.from(requireContext())
        val itemBinding = ItemSentenceBinding.inflate(inflater, binding.sentenceContainer, false)
        itemBinding.tvIndex.text = "$index."
        itemBinding.tvEnglish.text = sentence.text
        sentence.translation?.let {
            itemBinding.tvChinese.text = it
            itemBinding.tvChinese.visibility = View.VISIBLE
        } ?: run { itemBinding.tvChinese.visibility = View.GONE }
        binding.sentenceContainer.addView(itemBinding.root)
    }

    private fun getTypeLabel(type: String) = when (type) {
        "reading_aloud" -> "📖 朗读"
        "situational_qa" -> "💬 情景问答"
        "information_retelling" -> "🔄 信息复述"
        "role_play" -> "🎭 角色扮演"
        else -> type
    }

    private fun getDifficultyLabel(difficulty: String) = when (difficulty) {
        "easy" -> "⭐ 简单"
        "medium" -> "⭐⭐ 中等"
        "hard" -> "⭐⭐⭐ 困难"
        else -> difficulty
    }
}
