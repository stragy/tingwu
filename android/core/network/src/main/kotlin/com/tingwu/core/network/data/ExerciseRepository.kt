package com.tingwu.core.network.data

/**
 * 练习题目仓库接口
 */
interface ExerciseRepository {
    suspend fun getExercises(
        type: String? = null,
        difficulty: String? = null,
        page: Int = 1,
        pageSize: Int = 20
    ): Result<ExerciseListResponse>

    suspend fun getExerciseDetail(exerciseId: String): Result<ExerciseDetailResponse>
}
