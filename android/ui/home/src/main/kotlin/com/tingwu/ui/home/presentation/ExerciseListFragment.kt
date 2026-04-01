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
import com.google.android.material.chip.Chip
import com.tingwu.ui.common.base.BaseFragment
import com.tingwu.ui.home.R
import com.tingwu.ui.home.adapter.ExerciseAdapter
import com.tingwu.ui.home.databinding.FragmentExerciseListBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ExerciseListFragment : BaseFragment<FragmentExerciseListBinding>() {

    private val viewModel: ExerciseListViewModel by viewModels()
    private lateinit var adapter: ExerciseAdapter

    override fun createBinding(
        inflater: LayoutInflater,
        container: ViewGroup?
    ): FragmentExerciseListBinding =
        FragmentExerciseListBinding.inflate(inflater, container, false)

    override fun setupUI() {
        // RecyclerView
        adapter = ExerciseAdapter { exercise ->
            val args = bundleOf("exerciseId" to exercise.id, "exerciseTitle" to exercise.title)
            findNavController().navigate(R.id.action_exerciseListFragment_to_exerciseDetailFragment, args)
        }
        binding.recyclerView.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerView.adapter = adapter

        // 下拉刷新
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.refresh()
        }

        // 题型筛选 Chip
        setupFilterChips()

        // 重试按钮
        binding.btnRetry.setOnClickListener {
            viewModel.refresh()
        }
    }

    override fun setupObservers() {
        viewModel.exercises.observe(viewLifecycleOwner) { list ->
            adapter.submitList(list)
            binding.swipeRefreshLayout.isRefreshing = false
        }

        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            if (isLoading && adapter.itemCount == 0) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
                binding.swipeRefreshLayout.isRefreshing = false
            }
        }

        viewModel.isEmpty.observe(viewLifecycleOwner) { empty ->
            binding.layoutEmpty.visibility = if (empty) View.VISIBLE else View.GONE
            binding.recyclerView.visibility = if (empty) View.GONE else View.VISIBLE
        }

        viewModel.error.observe(viewLifecycleOwner) { message ->
            message?.let {
                if (adapter.itemCount == 0) {
                    binding.layoutError.visibility = View.VISIBLE
                    binding.tvError.text = it
                } else {
                    Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
                }
                viewModel.clearError()
            }
        }
    }

    private fun setupFilterChips() {
        val typeFilters = mapOf(
            binding.chipAll to null,
            binding.chipReading to "reading_aloud",
            binding.chipSituational to "situational_qa",
            binding.chipRetelling to "information_retelling",
            binding.chipRolePlay to "role_play"
        )
        typeFilters.forEach { (chip, type) ->
            chip.setOnClickListener {
                viewModel.filterByType(type)
                // 视觉上选中当前 chip
                typeFilters.keys.forEach { c -> c.isChecked = c == chip }
            }
        }
        binding.chipAll.isChecked = true
    }
}
