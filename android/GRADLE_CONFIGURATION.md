# Gradle构建系统配置文档

## 概述

本文档记录了Android应用的Gradle构建系统配置，包括所有模块的依赖管理、构建变体配置和代码混淆规则。

## 项目结构

```
android/
├── app/                          # 主应用模块
├── core/                         # 核心功能模块
│   ├── auth/                    # 认证模块
│   ├── audio/                   # 音频引擎模块
│   ├── network/                 # 网络通信模块
│   ├── offline-sync/            # 离线同步模块
│   ├── session/                 # 会话管理模块
│   ├── push-notification/       # 推送通知模块
│   └── storage/                 # 本地存储模块
├── ui/                          # UI模块
│   ├── common/                  # 通用UI组件
│   ├── auth/                    # 认证UI
│   └── practice/                # 练习UI
├── build.gradle.kts             # 根项目构建脚本
├── gradle.properties            # Gradle属性配置
└── settings.gradle.kts          # 项目设置
```

## 依赖版本管理

所有依赖版本在 `gradle.properties` 中集中管理，便于统一更新：

### 核心版本
- **Kotlin**: 1.9.0
- **Coroutines**: 1.7.3
- **Compile SDK**: 34
- **Min SDK**: 24
- **Target SDK**: 34

### AndroidX库版本
- **Core**: 1.12.0
- **AppCompat**: 1.6.1
- **Lifecycle**: 2.6.2
- **Room**: 2.6.1
- **WorkManager**: 2.8.1
- **DataStore**: 1.0.0
- **Security**: 1.1.0-alpha06

### 网络库版本
- **Retrofit**: 2.10.0
- **OkHttp**: 4.11.0
- **Gson**: 2.10.1

### Firebase版本
- **Firebase BOM**: 32.7.0

### 依赖注入
- **Hilt**: 2.48

### 媒体库版本
- **Media3 (ExoPlayer)**: 1.1.1

### 测试库版本
- **JUnit**: 4.13.2
- **Mockk**: 1.13.8
- **Mockito Kotlin**: 5.1.0
- **Mockito**: 5.5.0
- **Espresso**: 3.5.1
- **AndroidX Test Ext**: 1.1.5

### 调试工具
- **LeakCanary**: 2.13
- **Timber**: 5.0.1

## 依赖配置

### 根项目 (build.gradle.kts)

配置了所有子项目使用的插件：

```kotlin
plugins {
    id("com.android.application") version "8.1.0" apply false
    id("com.android.library") version "8.1.0" apply false
    kotlin("android") version "1.9.0" apply false
    kotlin("kapt") version "1.9.0" apply false
    id("com.google.dagger.hilt.android") version "2.48" apply false
    id("com.google.gms.google-services") version "4.4.0" apply false
    id("com.google.firebase.crashlytics") version "2.9.9" apply false
}
```

### 应用模块 (app/build.gradle.kts)

主应用模块包含以下依赖类别：

#### 1. 核心模块依赖
- `:core:auth` - 认证功能
- `:core:audio` - 音频处理
- `:core:offline-sync` - 离线同步
- `:core:session` - 会话管理
- `:core:push-notification` - 推送通知
- `:core:storage` - 本地存储
- `:core:network` - 网络通信
- `:ui:common` - 通用UI
- `:ui:auth` - 认证UI
- `:ui:practice` - 练习UI

#### 2. AndroidX库
- androidx.core:androidx-core
- androidx.appcompat:appcompat
- androidx.lifecycle:lifecycle-runtime-ktx
- androidx.lifecycle:lifecycle-viewmodel-ktx
- androidx.lifecycle:lifecycle-livedata-ktx
- androidx.work:work-runtime-ktx
- androidx.datastore:datastore-preferences

#### 3. Material Design 3
- com.google.android.material:material:1.11.0

#### 4. Kotlin Coroutines
- kotlinx-coroutines-android
- kotlinx-coroutines-core

#### 5. Hilt依赖注入
- com.google.dagger:hilt-android
- com.google.dagger:hilt-compiler (kapt)

#### 6. Retrofit + OkHttp网络库
- com.squareup.retrofit2:retrofit
- com.squareup.retrofit2:converter-gson
- com.squareup.okhttp3:okhttp
- com.squareup.okhttp3:logging-interceptor

#### 7. Room数据库
- androidx.room:room-runtime
- androidx.room:room-ktx
- androidx.room:room-compiler (kapt)

#### 8. Firebase
- firebase-messaging-ktx (FCM)
- firebase-analytics-ktx
- firebase-crashlytics-ktx
- firebase-perf-ktx

#### 9. ExoPlayer音频播放
- androidx.media3:media3-exoplayer
- androidx.media3:media3-common

#### 10. 安全库
- androidx.security:security-crypto

#### 11. 日志库
- com.jakewharton.timber:timber

#### 12. 调试工具
- com.squareup.leakcanary:leakcanary-android (debugImplementation)

#### 13. 测试库
- junit:junit
- io.mockk:mockk
- org.mockito.kotlin:mockito-kotlin
- org.mockito:mockito-core
- androidx.test.ext:junit (androidTestImplementation)
- androidx.test.espresso:espresso-core (androidTestImplementation)

### 核心模块依赖

#### core:auth (认证模块)
- 依赖: core:network, core:storage
- 关键库: Retrofit, OkHttp, Security Crypto, Coroutines

#### core:network (网络模块)
- 关键库: Retrofit, OkHttp, Gson, Coroutines

#### core:audio (音频模块)
- 关键库: ExoPlayer (Media3), Coroutines

#### core:offline-sync (离线同步模块)
- 依赖: core:storage, core:network
- 关键库: WorkManager, Coroutines

#### core:session (会话管理模块)
- 依赖: core:storage, core:network
- 关键库: Lifecycle, Coroutines

#### core:push-notification (推送通知模块)
- 依赖: core:network
- 关键库: Firebase Messaging, Coroutines

#### core:storage (本地存储模块)
- 关键库: Room, Security Crypto, DataStore, Gson, Coroutines

### UI模块依赖

#### ui:common (通用UI)
- 关键库: Material Design 3, Lifecycle, Coroutines

#### ui:auth (认证UI)
- 依赖: ui:common, core:auth
- 关键库: Material Design 3, Lifecycle, Coroutines

#### ui:practice (练习UI)
- 依赖: ui:common, core:session, core:audio, core:offline-sync
- 关键库: Material Design 3, Lifecycle, Coroutines

## 构建变体配置

### Debug构建
- 代码混淆: 禁用 (isMinifyEnabled = false)
- 调试信息: 保留
- LeakCanary: 启用

### Release构建
- 代码混淆: 启用 (isMinifyEnabled = true)
- ProGuard规则: 使用 proguard-android-optimize.txt 和 proguard-rules.pro
- 代码收缩: 启用
- 资源收缩: 启用

## ProGuard/R8混淆规则

文件位置: `android/app/proguard-rules.pro`

### 保留规则

#### Retrofit
```
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions
```

#### OkHttp
```
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
```

#### Kotlin
```
-keep class kotlin.** { *; }
-keep interface kotlin.** { *; }
```

#### Room
```
-keep class androidx.room.** { *; }
-keep interface androidx.room.** { *; }
```

#### Hilt
```
-keep class dagger.hilt.** { *; }
-keep interface dagger.hilt.** { *; }
```

#### Firebase
```
-keep class com.google.firebase.** { *; }
-keep interface com.google.firebase.** { *; }
```

#### 应用类
```
-keep class com.tingwu.app.** { *; }
-keep interface com.tingwu.app.** { *; }
```

#### 数据类
```
-keepclassmembers class * {
    *** *(...);
}
```

## 编译配置

### Java版本
- Source Compatibility: Java 17
- Target Compatibility: Java 17

### Kotlin编译选项
- JVM Target: 17

### 构建特性
- View Binding: 启用
- Data Binding: 启用

## 签名配置

Release构建需要配置签名信息。在 `local.properties` 或通过构建参数传递：

```properties
storeFile=path/to/keystore.jks
storePassword=password
keyAlias=alias
keyPassword=password
```

## 构建优化标志

### 启用的优化
- Gradle并行构建: 启用
- Gradle构建缓存: 启用
- JVM参数优化: -Xmx2048m

### 代码收缩
- Release构建启用R8代码收缩
- 自动移除未使用的代码和资源

### 资源收缩
- Release构建启用资源收缩
- 移除未使用的资源文件

## 依赖管理最佳实践

### 1. 版本统一
所有依赖版本在 `gradle.properties` 中定义，确保项目中使用一致的版本。

### 2. 模块化依赖
- 每个模块只依赖必要的库
- 避免循环依赖
- 使用 `implementation` 隐藏内部依赖

### 3. 测试依赖隔离
- 测试库使用 `testImplementation` 和 `androidTestImplementation`
- 不污染主代码的依赖

### 4. 调试工具隔离
- LeakCanary 仅在 Debug 构建中包含
- 减少 Release 构建的大小

## 常见任务

### 清理构建
```bash
./gradlew clean
```

### 构建Debug APK
```bash
./gradlew assembleDebug
```

### 构建Release APK
```bash
./gradlew assembleRelease
```

### 运行单元测试
```bash
./gradlew test
```

### 运行Instrumented测试
```bash
./gradlew connectedAndroidTest
```

### 检查依赖树
```bash
./gradlew dependencies
```

### 检查特定模块的依赖
```bash
./gradlew :app:dependencies
```

## 故障排除

### 依赖冲突
如果出现依赖版本冲突，使用以下命令查看依赖树：
```bash
./gradlew app:dependencies
```

### 构建缓存问题
清除Gradle缓存：
```bash
./gradlew clean --no-build-cache
```

### 内存不足
增加JVM内存（在 `gradle.properties` 中）：
```properties
org.gradle.jvmargs=-Xmx4096m
```

## 下一步

1. **配置签名**: 为Release构建配置签名密钥
2. **CI/CD集成**: 配置GitHub Actions进行自动构建和测试
3. **代码质量检查**: 集成Lint和Detekt进行代码质量检查
4. **性能监控**: 配置Firebase Performance Monitoring
5. **崩溃报告**: 配置Firebase Crashlytics

## 参考资源

- [Android Gradle Plugin文档](https://developer.android.com/studio/build)
- [Gradle官方文档](https://gradle.org/docs/)
- [ProGuard文档](https://www.guardsquare.com/proguard)
- [R8代码收缩文档](https://developer.android.com/studio/build/shrink-code)
