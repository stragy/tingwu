# Android 项目结构详解

## 目录树

```
android/
├── app/                                    # 主应用模块
│   ├── build.gradle.kts                   # 应用构建配置
│   ├── proguard-rules.pro                 # ProGuard 混淆规则
│   └── src/
│       ├── main/
│       │   ├── kotlin/com/tingwu/app/
│       │   │   ├── MainActivity.kt        # 主活动
│       │   │   ├── TingwuApplication.kt   # 应用类
│       │   │   ├── di/
│       │   │   │   ├── NetworkModule.kt   # 网络依赖注入
│       │   │   │   └── RepositoryModule.kt # 仓库依赖注入
│       │   │   ├── service/
│       │   │   │   └── TingwuMessagingService.kt # FCM 消息服务
│       │   │   └── ui/
│       │   │       └── DeepLinkActivity.kt # 深层链接处理
│       │   └── res/
│       │       ├── layout/
│       │       │   └── activity_main.xml
│       │       ├── navigation/
│       │       │   └── nav_graph.xml
│       │       ├── values/
│       │       │   ├── colors.xml
│       │       │   ├── strings.xml
│       │       │   └── themes.xml
│       │       └── xml/
│       │           ├── backup_rules.xml
│       │           └── data_extraction_rules.xml
│       └── AndroidManifest.xml
│
├── core/                                   # 核心业务逻辑模块
│   ├── auth/                              # 认证模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/core/auth/
│   │       ├── data/
│   │       │   └── AuthRepository.kt      # 认证仓库接口
│   │       └── domain/
│   │           ├── AuthToken.kt           # 认证令牌数据类
│   │           ├── AuthUseCase.kt         # 认证用例
│   │           └── Session.kt             # 会话数据类
│   │
│   ├── audio/                             # 音频引擎模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/core/audio/
│   │       ├── data/
│   │       │   └── AudioEngine.kt         # 音频引擎接口
│   │       └── domain/
│   │           ├── AudioFile.kt           # 音频文件数据类
│   │           └── AudioUseCase.kt        # 音频用例
│   │
│   ├── offline-sync/                      # 离线同步模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/core/offline_sync/
│   │       ├── data/
│   │       │   └── OfflineSyncRepository.kt # 离线同步仓库接口
│   │       └── domain/
│   │           ├── OfflineSyncUseCase.kt  # 离线同步用例
│   │           └── SyncData.kt            # 同步数据类
│   │
│   ├── session/                           # 会话管理模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/core/session/
│   │       ├── data/
│   │       │   └── SessionRepository.kt   # 会话仓库接口
│   │       └── domain/
│   │           ├── Session.kt             # 会话数据类
│   │           └── SessionUseCase.kt      # 会话用例
│   │
│   ├── push-notification/                 # 推送通知模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/core/push_notification/
│   │       ├── data/
│   │       │   └── PushNotificationRepository.kt # 推送仓库接口
│   │       └── domain/
│   │           ├── Notification.kt        # 通知数据类
│   │           └── PushNotificationUseCase.kt # 推送用例
│   │
│   ├── storage/                           # 本地存储模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/core/storage/
│   │       ├── data/
│   │       │   └── LocalStorageRepository.kt # 存储仓库接口
│   │       └── domain/
│   │           └── LocalStorageUseCase.kt # 存储用例
│   │
│   └── network/                           # 网络/API 集成模块
│       ├── build.gradle.kts
│       └── src/main/kotlin/com/tingwu/core/network/
│           └── data/
│               ├── ApiClient.kt           # Retrofit API 客户端
│               └── NetworkRepository.kt   # 网络仓库接口
│
├── ui/                                    # UI 表现层模块
│   ├── common/                            # 通用 UI 组件
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/ui/common/
│   │       └── base/
│   │           ├── BaseFragment.kt        # 基础 Fragment
│   │           └── BaseViewModel.kt       # 基础 ViewModel
│   │
│   ├── auth/                              # 认证 UI 模块
│   │   ├── build.gradle.kts
│   │   └── src/main/kotlin/com/tingwu/ui/auth/
│   │       └── presentation/
│   │           └── LoginViewModel.kt      # 登录 ViewModel
│   │
│   └── practice/                          # 练习 UI 模块
│       ├── build.gradle.kts
│       └── src/main/kotlin/com/tingwu/ui/practice/
│           └── presentation/
│               └── PracticeViewModel.kt   # 练习 ViewModel
│
├── build.gradle.kts                       # 根构建文件
├── settings.gradle.kts                    # 项目设置
├── gradle.properties                      # Gradle 属性
├── .gitignore                             # Git 忽略文件
├── README.md                              # 项目说明
└── PROJECT_STRUCTURE.md                   # 本文件

```

## 模块依赖关系

```
app
├── core:auth
├── core:audio
├── core:offline-sync
├── core:session
├── core:push-notification
├── core:storage
├── core:network
├── ui:common
├── ui:auth
└── ui:practice

core:auth
├── core:network
└── core:storage

core:offline-sync
├── core:storage
└── core:network

core:session
├── core:storage
└── core:network

core:push-notification
└── core:network

ui:auth
├── ui:common
└── core:auth

ui:practice
├── ui:common
├── core:session
├── core:audio
└── core:offline-sync
```

## 包命名规范

- **应用包**: `com.tingwu.app`
- **核心模块**: `com.tingwu.core.<module_name>`
- **UI 模块**: `com.tingwu.ui.<module_name>`
- **数据层**: `<package>.data`
- **领域层**: `<package>.domain`
- **表现层**: `<package>.presentation`

## 文件命名规范

- **Activity**: `*Activity.kt` (例: `MainActivity.kt`)
- **Fragment**: `*Fragment.kt` (例: `LoginFragment.kt`)
- **ViewModel**: `*ViewModel.kt` (例: `LoginViewModel.kt`)
- **Repository**: `*Repository.kt` (例: `AuthRepository.kt`)
- **UseCase**: `*UseCase.kt` (例: `AuthUseCase.kt`)
- **数据类**: `*.kt` (例: `AuthToken.kt`)
- **接口**: `*.kt` (例: `AudioEngine.kt`)

## 构建配置

### 根构建文件 (build.gradle.kts)
- 定义所有子项目的通用插件
- 配置 Gradle 任务

### 项目设置 (settings.gradle.kts)
- 定义项目结构
- 配置依赖仓库

### Gradle 属性 (gradle.properties)
- 定义 SDK 版本
- 定义依赖版本
- 配置 JVM 参数

## 资源文件组织

```
res/
├── layout/          # Activity 和 Fragment 布局
├── navigation/      # Navigation 图
├── values/          # 字符串、颜色、主题等
├── xml/             # 备份规则、数据提取规则等
├── drawable/        # 图片资源
├── menu/            # 菜单资源
└── anim/            # 动画资源
```

## 依赖注入配置

- **NetworkModule**: 配置 Retrofit、OkHttp、Gson
- **RepositoryModule**: 配置所有 Repository 实现
- **其他 Module**: 在各自的模块中配置

## 测试结构

```
src/
├── test/            # 单元测试
│   └── kotlin/
│       └── com/tingwu/...
│           └── *Test.kt
└── androidTest/     # 集成测试
    └── kotlin/
        └── com/tingwu/...
            └── *AndroidTest.kt
```

## 版本管理

- **compileSdk**: 34
- **minSdk**: 24
- **targetSdk**: 34
- **Kotlin**: 1.9.0
- **Gradle**: 8.1.0

## 下一步

1. 实现各模块的具体业务逻辑
2. 创建 UI 布局文件
3. 编写单元测试和集成测试
4. 配置 CI/CD 流程
5. 性能优化和安全加固
