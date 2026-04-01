package com.tingwu.ui.home.presentation

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.tingwu.ui.common.base.BaseFragment
import com.tingwu.ui.home.adapter.HistoryAdapter
import com.tingwu.ui.home.databinding.FragmentStatsBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class StatsFragment : BaseFragment<FragmentStatsBinding>() {

    private val viewModel: StatsViewModel by viewModels()
    private lateinit var historyAdapter: HistoryAdapter

    override fun createBinding(inflater: LayoutInflater, container: ViewGroup?): FragmentStatsBinding =
        FragmentStatsBinding.inflate(inflater, container, false)

    override fun setupUI() {
        historyAdapter = HistoryAdapter()
        binding.recyclerHistory.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerHistory.adapter = historyAdapter

        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.refresh()
        }
    }

    override fun setupObservers() {
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading
            if (isLoading) {
                binding.statsCard.visibility = View.GONE
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModel.statistics.observe(viewLifecycleOwner) { stats ->
            stats ?: return@observe
            binding.statsCard.visibility = View.VISIBLE

            binding.tvTotalPractices.text = stats.totalPractices.toString()
            binding.tvAverageScore.text = "%.1f".format(stats.averageScore)
            binding.tvBestScore.text = "%.1f".format(stats.bestScore)
            binding.tvStreakDays.text = stats.streakDays.toString()
            binding.tvTotalDuration.text = "${stats.totalDurationMinutes}分钟"

            // 分项评分进度条
            binding.progressPronunciation.progress = stats.averagePronunciation.toInt()
            binding.tvPronunciationScore.text = "%.1f".format(stats.averagePronunciation)
            binding.progressFluency.progress = stats.averageFluency.toInt()
            binding.tvFluencyScore.text = "%.1f".format(stats.averageFluency)
            binding.progressContent.progress = stats.averageContent.toInt()
            binding.tvContentScore.text = "%.1f".format(stats.averageContent)
        }

        viewModel.history.observe(viewLifecycleOwner) { list ->
            historyAdapter.submitList(list)
            binding.layoutEmptyHistory.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
        }

        viewModel.error.observe(viewLifecycleOwner) { msg ->
            msg?.let {
                binding.swipeRefreshLayout.isRefreshing = false
                viewModel.clearError()
            }
        }
    }
}
