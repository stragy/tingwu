package com.tingwu.ui.home.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.tingwu.ui.home.presentation.HistoryItem
import com.tingwu.ui.home.databinding.ItemHistoryBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class HistoryAdapter : ListAdapter<HistoryItem, HistoryAdapter.ViewHolder>(DIFF_CALLBACK) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemHistoryBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(private val binding: ItemHistoryBinding) :
        RecyclerView.ViewHolder(binding.root) {

        private val dateFormat = SimpleDateFormat("MM月dd日 HH:mm", Locale.CHINESE)

        fun bind(item: HistoryItem) {
            binding.tvExerciseTitle.text = item.exerciseTitle
            binding.tvScore.text = "${item.score.toInt()}分"
            binding.tvDate.text = dateFormat.format(Date(item.date))

            // 分数颜色
            val scoreColor = when {
                item.score >= 80 -> 0xFF2196F3.toInt()
                item.score >= 60 -> 0xFFFF9800.toInt()
                else -> 0xFFF44336.toInt()
            }
            binding.tvScore.setTextColor(scoreColor)
        }
    }

    companion object {
        private val DIFF_CALLBACK = object : DiffUtil.ItemCallback<HistoryItem>() {
            override fun areItemsTheSame(a: HistoryItem, b: HistoryItem) = a.id == b.id
            override fun areContentsTheSame(a: HistoryItem, b: HistoryItem) = a == b
        }
    }
}
