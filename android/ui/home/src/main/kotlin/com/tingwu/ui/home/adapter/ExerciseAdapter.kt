package com.tingwu.ui.home.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.tingwu.core.network.data.ExerciseItem
import com.tingwu.ui.home.databinding.ItemExerciseBinding

class ExerciseAdapter(
    private val onItemClick: (ExerciseItem) -> Unit
) : ListAdapter<ExerciseItem, ExerciseAdapter.ViewHolder>(DIFF_CALLBACK) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemExerciseBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(private val binding: ItemExerciseBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: ExerciseItem) {
            binding.tvTitle.text = item.title
            binding.tvType.text = getTypeLabel(item.type)
            binding.tvDifficulty.text = getDifficultyLabel(item.difficulty)
            binding.tvDuration.text = formatDuration(item.duration)

            // 难度颜色
            val difficultyColor = getDifficultyColor(item.difficulty)
            binding.tvDifficulty.setTextColor(difficultyColor)

            // 题型图标颜色
            val typeColor = getTypeColor(item.type)
            binding.viewTypeIndicator.setBackgroundColor(typeColor)

            binding.root.setOnClickListener { onItemClick(item) }
        }

        private fun getTypeLabel(type: String): String = when (type) {
            "reading_aloud" -> "朗读"
            "situational_qa" -> "情景问答"
            "information_retelling" -> "信息复述"
            "role_play" -> "角色扮演"
            else -> type
        }

        private fun getDifficultyLabel(difficulty: String): String = when (difficulty) {
            "easy" -> "简单"
            "medium" -> "中等"
            "hard" -> "困难"
            else -> difficulty
        }

        private fun formatDuration(seconds: Int): String {
            return if (seconds >= 60) "${seconds / 60}分${seconds % 60}秒"
            else "${seconds}秒"
        }

        private fun getDifficultyColor(difficulty: String): Int {
            val context = binding.root.context
            return when (difficulty) {
                "easy" -> context.getColor(android.R.color.holo_green_dark)
                "medium" -> context.getColor(android.R.color.holo_orange_dark)
                "hard" -> context.getColor(android.R.color.holo_red_dark)
                else -> context.getColor(android.R.color.darker_gray)
            }
        }

        private fun getTypeColor(type: String): Int {
            val context = binding.root.context
            return when (type) {
                "reading_aloud" -> 0xFF2196F3.toInt()
                "situational_qa" -> 0xFF4CAF50.toInt()
                "information_retelling" -> 0xFFFF9800.toInt()
                "role_play" -> 0xFF9C27B0.toInt()
                else -> 0xFF607D8B.toInt()
            }
        }
    }

    companion object {
        private val DIFF_CALLBACK = object : DiffUtil.ItemCallback<ExerciseItem>() {
            override fun areItemsTheSame(oldItem: ExerciseItem, newItem: ExerciseItem) =
                oldItem.id == newItem.id

            override fun areContentsTheSame(oldItem: ExerciseItem, newItem: ExerciseItem) =
                oldItem == newItem
        }
    }
}
