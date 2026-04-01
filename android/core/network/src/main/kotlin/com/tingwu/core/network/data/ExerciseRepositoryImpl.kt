package com.tingwu.core.network.data

import android.util.Log

/**
 * 练习题目仓库实现
 * - 由外部（app 模块的 RepositoryModule）注入 ApiClient 和 token 获取器
 * - 网络失败时返回内置 Mock 数据，保证离线可用
 */
class ExerciseRepositoryImpl(
    private val apiClient: ApiClient,
    private val tokenProvider: ExerciseTokenProvider
) : ExerciseRepository {

    companion object {
        private const val TAG = "ExerciseRepository"

        // ===== Mock 数据（后端不可用时兜底）=====
        val MOCK_EXERCISES = listOf(
            ExerciseItem(
                id = "exercise_001",
                title = "旅游购物情景对话",
                type = "situational_qa",
                difficulty = "easy",
                duration = 120
            ),
            ExerciseItem(
                id = "exercise_002",
                title = "学校生活介绍",
                type = "reading_aloud",
                difficulty = "easy",
                duration = 90
            ),
            ExerciseItem(
                id = "exercise_003",
                title = "环保主题信息复述",
                type = "information_retelling",
                difficulty = "medium",
                duration = 180
            ),
            ExerciseItem(
                id = "exercise_004",
                title = "餐厅点餐角色扮演",
                type = "role_play",
                difficulty = "medium",
                duration = 150
            ),
            ExerciseItem(
                id = "exercise_005",
                title = "科技话题朗读",
                type = "reading_aloud",
                difficulty = "hard",
                duration = 120
            ),
            ExerciseItem(
                id = "exercise_006",
                title = "健康生活情景问答",
                type = "situational_qa",
                difficulty = "medium",
                duration = 150
            ),
            ExerciseItem(
                id = "exercise_007",
                title = "历史事件信息复述",
                type = "information_retelling",
                difficulty = "hard",
                duration = 200
            ),
            ExerciseItem(
                id = "exercise_008",
                title = "求职面试角色扮演",
                type = "role_play",
                difficulty = "hard",
                duration = 180
            )
        )

        val MOCK_DETAILS = mapOf(
            "exercise_001" to ExerciseDetailResponse(
                id = "exercise_001",
                title = "旅游购物情景对话",
                type = "situational_qa",
                difficulty = "easy",
                content = ExerciseContent(
                    instructions = "请根据以下情景，用英语回答问题。",
                    sentences = listOf(
                        ExerciseSentence(0, "Where are you planning to travel this summer?", "你今年夏天打算去哪里旅游？"),
                        ExerciseSentence(1, "What souvenirs would you like to buy?", "你想买什么纪念品？"),
                        ExerciseSentence(2, "How much do you plan to spend on shopping?", "你计划花多少钱购物？")
                    )
                )
            ),
            "exercise_002" to ExerciseDetailResponse(
                id = "exercise_002",
                title = "学校生活介绍",
                type = "reading_aloud",
                difficulty = "easy",
                content = ExerciseContent(
                    instructions = "请大声朗读以下短文。",
                    sentences = listOf(
                        ExerciseSentence(0, "School life is full of excitement and challenges.", "学校生活充满了精彩和挑战。"),
                        ExerciseSentence(1, "Every day, students learn new things and make new friends.", "每天，学生们学习新知识，结交新朋友。"),
                        ExerciseSentence(2, "After-school activities help students develop their talents.", "课外活动帮助学生发展他们的才能。"),
                        ExerciseSentence(3, "I love my school because it gives me many opportunities.", "我爱我的学校，因为它给了我很多机会。")
                    )
                )
            ),
            "exercise_003" to ExerciseDetailResponse(
                id = "exercise_003",
                title = "环保主题信息复述",
                type = "information_retelling",
                difficulty = "medium",
                content = ExerciseContent(
                    instructions = "请听录音，然后用英语复述你所听到的主要内容。",
                    sentences = listOf(
                        ExerciseSentence(0, "Climate change is one of the biggest challenges we face.", "气候变化是我们面临的最大挑战之一。"),
                        ExerciseSentence(1, "Reducing carbon emissions is essential for a sustainable future.", "减少碳排放对可持续未来至关重要。"),
                        ExerciseSentence(2, "Every individual can make a difference by adopting eco-friendly habits.", "每个人都可以通过养成环保习惯来做出贡献。")
                    )
                )
            ),
            "exercise_004" to ExerciseDetailResponse(
                id = "exercise_004",
                title = "餐厅点餐角色扮演",
                type = "role_play",
                difficulty = "medium",
                content = ExerciseContent(
                    instructions = "你是顾客，请根据提示与服务员进行对话。",
                    sentences = listOf(
                        ExerciseSentence(0, "Good evening! I'd like to make a reservation.", "晚上好！我想预订座位。"),
                        ExerciseSentence(1, "Could I see the menu, please?", "请给我看看菜单好吗？"),
                        ExerciseSentence(2, "I'll have the grilled salmon and a glass of orange juice.", "我要烤三文鱼和一杯橙汁。"),
                        ExerciseSentence(3, "Could you recommend your specialty dish?", "你能推荐一下你们的招牌菜吗？")
                    )
                )
            ),
            "exercise_005" to ExerciseDetailResponse(
                id = "exercise_005",
                title = "科技话题朗读",
                type = "reading_aloud",
                difficulty = "hard",
                content = ExerciseContent(
                    instructions = "请大声朗读以下科技类文章。",
                    sentences = listOf(
                        ExerciseSentence(0, "Artificial intelligence is transforming every aspect of modern life.", "人工智能正在改变现代生活的方方面面。"),
                        ExerciseSentence(1, "From healthcare to transportation, AI applications are becoming ubiquitous.", "从医疗到交通，人工智能应用正变得无处不在。"),
                        ExerciseSentence(2, "However, we must address ethical concerns as this technology advances.", "然而，随着技术进步，我们必须解决道德问题。")
                    )
                )
            ),
            "exercise_006" to ExerciseDetailResponse(
                id = "exercise_006",
                title = "健康生活情景问答",
                type = "situational_qa",
                difficulty = "medium",
                content = ExerciseContent(
                    instructions = "请用英语回答以下关于健康生活方式的问题。",
                    sentences = listOf(
                        ExerciseSentence(0, "How often do you exercise each week?", "你每周锻炼几次？"),
                        ExerciseSentence(1, "What do you eat for a healthy breakfast?", "你早餐吃什么来保持健康？"),
                        ExerciseSentence(2, "How do you manage stress in your daily life?", "你如何管理日常生活中的压力？")
                    )
                )
            ),
            "exercise_007" to ExerciseDetailResponse(
                id = "exercise_007",
                title = "历史事件信息复述",
                type = "information_retelling",
                difficulty = "hard",
                content = ExerciseContent(
                    instructions = "请听取关于历史事件的描述，然后用英语复述主要内容。",
                    sentences = listOf(
                        ExerciseSentence(0, "The Industrial Revolution began in Britain in the late 18th century.", "工业革命于18世纪末在英国开始。"),
                        ExerciseSentence(1, "It marked a major turning point in human history.", "这是人类历史上的一个重大转折点。"),
                        ExerciseSentence(2, "Steam power and mechanized production changed economies worldwide.", "蒸汽动力和机械化生产改变了全球经济。")
                    )
                )
            ),
            "exercise_008" to ExerciseDetailResponse(
                id = "exercise_008",
                title = "求职面试角色扮演",
                type = "role_play",
                difficulty = "hard",
                content = ExerciseContent(
                    instructions = "你是求职者，请进行英语面试对话。",
                    sentences = listOf(
                        ExerciseSentence(0, "Tell me about yourself and your work experience.", "请介绍一下你自己和你的工作经验。"),
                        ExerciseSentence(1, "Why are you interested in this position?", "你为什么对这个职位感兴趣？"),
                        ExerciseSentence(2, "What are your greatest strengths and weaknesses?", "你最大的优点和缺点是什么？"),
                        ExerciseSentence(3, "Where do you see yourself in five years?", "五年后你认为你会在哪里？")
                    )
                )
            ),
            "exercise_demo_001" to ExerciseDetailResponse(
                id = "exercise_demo_001",
                title = "示例练习题",
                type = "reading_aloud",
                difficulty = "easy",
                content = ExerciseContent(
                    instructions = "请大声朗读以下句子。",
                    sentences = listOf(
                        ExerciseSentence(0, "The weather is nice today.", "今天天气很好。"),
                        ExerciseSentence(1, "I like to study English every day.", "我喜欢每天学习英语。"),
                        ExerciseSentence(2, "Practice makes perfect.", "熟能生巧。")
                    )
                )
            )
        )
    }

    override suspend fun getExercises(
        type: String?,
        difficulty: String?,
        page: Int,
        pageSize: Int
    ): Result<ExerciseListResponse> {
        return try {
            val token = tokenProvider.getToken()
            if (token != null) {
                val response = apiClient.getExercises(
                    token = "Bearer $token",
                    type = type,
                    difficulty = difficulty,
                    page = page,
                    pageSize = pageSize
                )
                if (response.code == 200 && response.data != null) {
                    Log.d(TAG, "getExercises from backend: ${response.data.items.size} items")
                    Result.success(response.data)
                } else {
                    Log.w(TAG, "getExercises backend error ${response.code}, falling back to mock")
                    Result.success(buildMockList(type, difficulty, page, pageSize))
                }
            } else {
                Log.w(TAG, "getExercises: no auth token, using mock data")
                Result.success(buildMockList(type, difficulty, page, pageSize))
            }
        } catch (e: Exception) {
            Log.e(TAG, "getExercises network error, using mock data", e)
            Result.success(buildMockList(type, difficulty, page, pageSize))
        }
    }

    override suspend fun getExerciseDetail(exerciseId: String): Result<ExerciseDetailResponse> {
        return try {
            val token = tokenProvider.getToken()
            if (token != null) {
                val response = apiClient.getExerciseDetail(
                    token = "Bearer $token",
                    exerciseId = exerciseId
                )
                if (response.code == 200 && response.data != null) {
                    Log.d(TAG, "getExerciseDetail from backend: ${response.data.title}")
                    Result.success(response.data)
                } else {
                    Log.w(TAG, "getExerciseDetail backend error, falling back to mock")
                    getMockDetail(exerciseId)
                }
            } else {
                getMockDetail(exerciseId)
            }
        } catch (e: Exception) {
            Log.e(TAG, "getExerciseDetail network error, using mock", e)
            getMockDetail(exerciseId)
        }
    }

    private fun buildMockList(type: String?, difficulty: String?, page: Int, pageSize: Int): ExerciseListResponse {
        var filtered = MOCK_EXERCISES
        if (type != null) filtered = filtered.filter { it.type == type }
        if (difficulty != null) filtered = filtered.filter { it.difficulty == difficulty }
        val offset = (page - 1) * pageSize
        val paged = filtered.drop(offset).take(pageSize)
        return ExerciseListResponse(items = paged, total = filtered.size, page = page, pageSize = pageSize)
    }

    private fun getMockDetail(exerciseId: String): Result<ExerciseDetailResponse> {
        val detail = MOCK_DETAILS[exerciseId]
        return if (detail != null) {
            Result.success(detail)
        } else {
            Result.success(MOCK_DETAILS.values.first())
        }
    }
}

/**
 * Token 提供器接口，用于隔离 core:network 对 core:auth 的直接依赖
 */
fun interface ExerciseTokenProvider {
    suspend fun getToken(): String?
}
