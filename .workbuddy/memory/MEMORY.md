# 听悟 Android 项目长期记忆

## 项目概况

- **项目名称**：听悟 (TingwuApp) — 中考英语听说训练 Android App
- **工作区路径**：`g:\听说\`
- **架构**：Clean Architecture + MVVM + Hilt DI + Coroutines
- **模块结构**：11个模块（1 app + 7 core + 3 ui）
- **主要技术栈**：Kotlin 1.9.0, AGP 8.1.0, Hilt 2.48, Retrofit, Room, Firebase, ExoPlayer

## 已完成的关键工作（截至 2026-03-29）

### 后端（packages/ 下的 6 个 Node.js 服务）
1. **环境变量安全**：清除所有硬编码 JWT_SECRET 回退值，强制启动时校验
2. **API Gateway**：新建 `packages/gateway/`，Nginx 反向代理统一路由到 6 个后端服务
3. **AI 模型接入**：evaluation-service 接入 Mock/腾讯云ASR/科大讯飞，支持环境变量切换
4. **测试修复**：所有服务测试文件添加 JWT_SECRET 环境变量预设

### Android 客户端（`android/` 目录）— 第一轮
1. **strings.xml**：补全 LoginFragment 和 PracticeFragment 引用的全部缺失字符串资源
2. **fragment_practice.xml**：新建练习录音界面布局（含 btnRecord/btnPause/btnResume/btnSubmit/recordingIndicator/tvRecordingTime/volumeBar/progressBar）
3. **nav_graph.xml**：补全 loginFragment 的 `<action>` 跳转到 practiceFragment（含 popUpTo 清栈）
4. **SessionRepository 实现**：内存 ConcurrentHashMap + 协程自动保存（30s间隔）
5. **AudioEngine 实现**：新建 `MediaRecorderAudioEngine`，真实 MediaRecorder 录音，100ms 轮询音量/时长回调
6. **AuthInterceptor**：新建 JWT Bearer Token 自动注入拦截器，支持 401 自动刷新，用 `Lazy<AuthRepository>` 打破循环依赖
7. **EncryptedLocalStorage**：新建 AES-256-GCM EncryptedSharedPreferences 实现，替换不可持久化的内存 Map

### Android 客户端（`android/` 目录）— 第二轮（2026-03-23 完成）
1. **OfflineSyncRepository 真实实现**：`SyncWorker` 用 `@HiltWorker + @AssistedInject` 重写，处理 `session_result` 和 `practice_audio` 两种数据类型，WorkManager 集成
2. **PushNotificationRepository 真实实现**：完整 FCM 实现（`TingwuMessagingService.kt`），Token 自动注册上报后端，消息回调，系统通知，`deep_link` 跳转处理
3. **练习结果页 / 成绩展示**：新建 `ResultFragment.kt` + `ResultViewModel.kt`，含动态评分颜色（≥80 蓝/≥60 橙/其他红），句子详情列表，MediaPlayer 音频播放
4. **Navigation Component 完整接入**：`app/build.gradle.kts` + `ui/practice/build.gradle.kts` 添加 navigation 依赖（版本 2.7.7），root `build.gradle.kts` 添加 Safe Args 插件
5. **nav_graph.xml 扩展**：添加 `resultFragment` 节点及跳转 action，支持 `evaluationId`/`sessionId` 参数传递
6. **HiltWorkerFactory 配置**：`TingwuApplication` 实现 `Configuration.Provider`，注入 `HiltWorkerFactory`，AndroidManifest 禁用默认初始化器
7. **EvaluationRepository 绑定**：`RepositoryModule.kt` 添加 `EvaluationRepositoryImpl` 的 `@Provides @Singleton` 绑定
8. **PushNotificationRepositoryImpl typo 修复**：`_notachments` → `_notifications`（3 处）

### 后端 + Android — 第三轮：API 全链路路由对齐（2026-03-29）
1. **Nginx 路由补全**：新增 `location /auth/` 和 `location /notification/` → auth_service，解决 Android 无前缀调用路径在 Nginx 不可达的问题
2. **NetworkModule.kt**：`baseUrl` 改用 `BuildConfig.API_BASE_URL`（Debug=`http://10.0.2.2:80/`，Release=`https://api.tingwu.com/`）；HttpLoggingInterceptor 仅 Debug 输出 BODY
3. **build.gradle.kts（app 模块）**：启用 `buildConfig=true`，在 debug/release buildType 中各注入 `API_BASE_URL`

## 关键技术决策

- **循环依赖解决**：NetworkModule → AuthInterceptor → AuthRepository → ApiClient → OkHttpClient，通过 `dagger.Lazy<AuthRepository>` 打破循环
- **EncryptedSharedPreferences 注意**：存储值均为 String 类型，读取 Long 时需要 `toLongOrNull()` 转换（已在 isTokenValid 中修复）
- **MediaRecorder API 兼容**：Android S (API 31) 以上需用 `MediaRecorder(context)`，以下用 `MediaRecorder()`
- **录音格式**：AAC/M4A，128kbps，44.1kHz，已是高压缩格式故 compressAudio 直接返回原文件
- **跨模块 R 类访问**：`ui/practice` 无法直接访问 `app` 模块的 `R.string.*` 和 `R.id.*`，解决方案：在 `ui/practice/src/main/res/values/` 下分别创建 `strings.xml` 和 `navigation_ids.xml`，声明本模块自己的资源
- **HiltWorker 注入模式**：WorkManager Worker 不能用 `@AndroidEntryPoint`，必须用 `@HiltWorker` + `@AssistedInject`，并在 Application 中配置 `HiltWorkerFactory`
- **Navigation Cross-Module**：`PracticeFragment` 用 Bundle 方式（`findNavController().navigate(R.id.action_xxx, bundle)`）替代 Safe Args 生成的 Directions 类，避免跨模块编译依赖问题

## Docker 启动说明（2026-03-29 验证）

### 开发环境（仅基础服务）
```powershell
cd g:\听说
docker compose -f docker-compose.dev.yml -p tingwu up -d
```
- 需要 `-p tingwu` 参数，因为目录名含中文 docker-compose 无法自动推断项目名
- localstack 镜像需从 `docker.m.daocloud.io/localstack/localstack:latest` 拉取后打 tag

### 启动的服务及端口
| 容器 | 端口 |
|------|------|
| tingwu-postgres | 5432 |
| tingwu-redis | 6379 |
| tingwu-localstack | 4566 |

### 完整生产环境（含 6 个微服务 + gateway）
```powershell
docker compose -p tingwu up -d
```
- 需要 `.env` 文件中设置 `JWT_SECRET`、`REFRESH_TOKEN_SECRET`、`DB_PASSWORD`

## 待完成工作

- 端到端联调：启动 docker-compose，模拟器跑 debug build，验证登录 → 练习列表 → 提交评测 → 结果页完整流程
- `EvaluationRepositoryImpl` 的 exerciseId 目前仍固定 "exercise_demo_001"，需从 `PracticeFragment` 传入真实 ID
