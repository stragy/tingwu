
# 听悟 Android 应用

## 项目概述

听悟 Android 应用是为"听悟中考AI听说"平台开发的原生应用，采用 Kotlin 语言和 MVVM 架构，支持离线功能、本地音频处理和系统级集成。

## 项目结构

```
android/
├── app/                          # 主应用模块
│   ├── src/main/
│   │   ├── kotlin/com/tingwu/app/
│   │   │   ├── MainActivity.kt
│   │   │   ├── TingwuApplication.kt
│   │   │   ├── di/               # 依赖注入配置
│   │   │   ├── service/          # 后台服务
│   │   │   └── ui/               # UI 相关
│   │   └── res/                  # 资源文件
│   └── build.gradle.kts
│
├── core/                         # 核心模块
│   ├── auth/                     # 认证模块
│   ├── audio/                    # 音频引擎
│   ├── offline-sync/             # 离线同步
│   ├── session/                  # 会话管理
│   ├── push-notification/        # 推送通知
│   ├── storage/                  # 本地存储
│   └── network/                  # 网络/API 集成
│
├── ui/                           # UI 模块
│   ├── common/                   # 通用 UI 组件
│   ├── auth/                     # 认证 UI
│   └── practice/                 # 练习 UI
│
├── build.gradle.kts              # 根构建文件
├── settings.gradle.kts           # 项目设置
└── gradle.properties             # Gradle 属性

```

## 技术栈

- **语言**: Kotlin
- **架构**: MVVM + Clean Architecture
- **UI 框架**: AndroidX, Material Design 3
- **依赖注入**: Hilt
- **网络**: Retrofit + OkHttp
- **数据库**: Room + SQLite
- **后台任务**: WorkManager
- **推送通知**: Firebase Cloud Messaging (FCM)
- **音频处理**: MediaRecorder, ExoPlayer
- **分析**: Firebase Analytics, Firebase Crashlytics

## 核心模块说明

### 1. Auth Module (认证模块)
- 手机号验证和短信验证码验证
- 令牌管理（获取、刷新、撤销）
- 会话管理
- 自动登录

### 2. Audio Engine (音频引擎)
- 音频录制（麦克风权限管理）
- 音频播放
- 音频压缩（MP3 128kbps）
- 音量检测和实时反馈

### 3. Offline Sync Module (离线同步模块)
- 网络状态检测
- 同步队列管理
- 自动同步数据
- 冲突解决

### 4. Session Management (会话管理模块)
- 创建和管理练习会话
- 定期保存会话状态
- 暂停/恢复功能
- 会话数据提交

### 5. Push Notification (推送通知模块)
- 推送权限请求
- 设备令牌注册/注销
- 推送通知处理
- 深层链接处理

### 6. Local Storage (本地存储模块)
- 本地数据库管理
- 数据加密/解密
- 缓存管理
- 数据清理

### 7. Network/API Integration (API 集成)
- HTTPS 通信
- 令牌管理
- 错误处理和重试
- 请求去重和合并

## 构建和运行

### 前置条件
- Android Studio 2023.1 或更高版本
- JDK 17 或更高版本
- Android SDK 34 或更高版本
- Gradle 8.0 或更高版本

### 构建项目
```bash
cd android
./gradlew build
```

### 运行应用
```bash
./gradlew installDebug
```

### 运行测试
```bash
./gradlew test
```

## 性能目标

- **冷启动**: < 5 秒
- **热启动**: < 2 秒
- **内存占用**: < 150 MB
- **帧率**: 60 fps
- **API 响应时间**: < 2 秒

## 安全特性

- TLS 1.2+ HTTPS 通信
- Android Keystore 令牌存储
- AES-256 数据加密
- 证书固定（Certificate Pinning）
- 敏感数据日志过滤
- 代码混淆（ProGuard/R8）

## 开发指南

### 添加新的 Feature
1. 在 `core/` 中创建新的模块
2. 定义 Repository 接口和 UseCase
3. 在 `ui/` 中创建对应的 UI 模块
4. 在 `di/` 中配置依赖注入
5. 编写单元测试和属性测试

### 代码规范
- 遵循 Kotlin 官方编码规范
- 使用 Hilt 进行依赖注入
- 使用 LiveData 进行数据绑定
- 使用 Coroutines 进行异步操作
- 编写单元测试覆盖核心逻辑

## 许可证

MIT License
