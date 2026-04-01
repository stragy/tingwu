# Android 项目设置指南

## 环境要求

- **Android Studio**: 2023.1 或更高版本
- **JDK**: 17 或更高版本
- **Android SDK**: 34 或更高版本
- **Gradle**: 8.0 或更高版本
- **Kotlin**: 1.9.0

## 初始化步骤

### 1. 克隆项目
```bash
git clone <repository-url>
cd android
```

### 2. 配置 local.properties
在项目根目录创建 `local.properties` 文件：
```properties
sdk.dir=/path/to/android/sdk
```

### 3. 构建项目
```bash
./gradlew build
```

### 4. 运行应用
```bash
./gradlew installDebug
```

## 项目配置

### Gradle 属性
编辑 `gradle.properties` 配置以下内容：
- SDK 版本
- 依赖版本
- JVM 参数

### 依赖管理
所有依赖版本在 `gradle.properties` 中定义，便于统一管理。

## 开发工作流

### 1. 创建新功能分支
```bash
git checkout -b feature/your-feature-name
```

### 2. 开发和测试
```bash
./gradlew test
./gradlew androidTest
```

### 3. 代码检查
```bash
./gradlew lint
./gradlew detekt
```

### 4. 提交代码
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

## 常用命令

### 构建
```bash
./gradlew build              # 构建所有模块
./gradlew app:build          # 构建应用模块
./gradlew core:auth:build    # 构建特定模块
```

### 测试
```bash
./gradlew test               # 运行单元测试
./gradlew androidTest        # 运行集成测试
./gradlew testDebug          # 运行 Debug 构建的测试
```

### 代码质量
```bash
./gradlew lint               # 运行 Lint 检查
./gradlew detekt             # 运行 Detekt 检查
```

### 安装和运行
```bash
./gradlew installDebug       # 安装 Debug 版本
./gradlew installRelease     # 安装 Release 版本
./gradlew run                # 运行应用
```

### 清理
```bash
./gradlew clean              # 清理构建文件
./gradlew cleanBuildCache    # 清理构建缓存
```

## IDE 配置

### Android Studio 设置
1. **Kotlin 代码风格**: Settings → Editor → Code Style → Kotlin
2. **Gradle 设置**: Settings → Build, Execution, Deployment → Gradle
3. **SDK 位置**: Settings → Appearance & Behavior → System Settings → Android SDK

### 推荐插件
- Kotlin
- Android ButterKnife Zelezny
- Hilt
- Firebase

## 调试

### 启用调试日志
在 `gradle.properties` 中添加：
```properties
org.gradle.logging.level=debug
```

### 使用 Android Studio 调试器
1. 设置断点
2. 运行 Debug 构建
3. 使用调试工具栏控制执行

### 查看日志
```bash
adb logcat
adb logcat | grep tingwu
```

## 性能分析

### 使用 Android Profiler
1. 运行应用
2. 打开 Android Profiler (View → Tool Windows → Profiler)
3. 分析 CPU、内存、网络等指标

### 使用 LeakCanary
LeakCanary 已在依赖中配置，可自动检测内存泄漏。

## 常见问题

### Q: 构建失败，提示找不到 SDK
A: 确保 `local.properties` 中的 `sdk.dir` 指向正确的 Android SDK 路径。

### Q: Gradle 同步失败
A: 尝试以下步骤：
1. File → Invalidate Caches
2. 重新启动 Android Studio
3. 运行 `./gradlew clean`

### Q: 编译错误：找不到符号
A: 确保所有依赖都已正确配置，运行 `./gradlew build --refresh-dependencies`

## 下一步

1. 配置 Firebase 项目
2. 设置 CI/CD 流程
3. 配置代码签名
4. 准备发布到 Google Play

## 参考资源

- [Android 官方文档](https://developer.android.com/)
- [Kotlin 官方文档](https://kotlinlang.org/)
- [Gradle 官方文档](https://gradle.org/)
- [Hilt 文档](https://dagger.dev/hilt/)
- [Retrofit 文档](https://square.github.io/retrofit/)
