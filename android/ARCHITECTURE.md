# Android 应用架构设计

## 架构概述

本项目采用 **MVVM (Model-View-ViewModel) + Clean Architecture** 的分层架构设计，确保代码的可维护性、可测试性和可扩展性。

## 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│  (Activities, Fragments, ViewModels, UI Components)     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│  (UseCases, Entities, Repository Interfaces)            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                           │
│  (Repository Implementations, Data Sources, Models)     │
└─────────────────────────────────────────────────────────┘
```

## 模块结构

### 1. Presentation Layer (表现层)

**位置**: `ui/` 目录

**职责**:
- 显示 UI
- 处理用户交互
- 管理 UI 状态

**组件**:
- **Activity**: 应用的入口点和容器
- **Fragment**: UI 的基本单位
- **ViewModel**: 管理 UI 相关的数据和逻辑
- **LiveData**: 可观察的数据容器
- **ViewBinding**: 类型安全的视图绑定

**示例**:
```kotlin
@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authUseCase: AuthUseCase
) : BaseViewModel() {
    
    private val _loginSuccess = MutableLiveData<Boolean>()
    val loginSuccess: LiveData<Boolean> = _loginSuccess
    
    fun login(phoneNumber: String, code: String) {
        viewModelScope.launch {
            authUseCase.verifySmsCode(phoneNumber, code)
                .onSuccess { _loginSuccess.value = true }
                .onFailure { setError(it.message) }
        }
    }
}
```

### 2. Domain Layer (领域层)

**位置**: `core/*/domain/` 目录

**职责**:
- 定义业务规则
- 定义 UseCase
- 定义 Repository 接口
- 定义实体和值对象

**组件**:
- **UseCase**: 业务逻辑的单一职责类
- **Repository Interface**: 数据访问的抽象
- **Entity**: 业务实体
- **Value Object**: 值对象

**示例**:
```kotlin
class AuthUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend fun verifySmsCode(phoneNumber: String, code: String) =
        repository.verifySmsCode(phoneNumber, code)
}

interface AuthRepository {
    suspend fun verifySmsCode(phoneNumber: String, code: String): Result<AuthToken>
}

data class AuthToken(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long
)
```

### 3. Data Layer (数据层)

**位置**: `core/*/data/` 目录

**职责**:
- 实现 Repository
- 管理数据源（本地、远程）
- 数据转换和映射

**组件**:
- **Repository Implementation**: Repository 接口的实现
- **Data Source**: 数据源（API、数据库、SharedPreferences）
- **DTO**: 数据传输对象
- **Mapper**: 数据转换

**示例**:
```kotlin
class AuthRepositoryImpl @Inject constructor(
    private val apiClient: ApiClient,
    private val localStorage: LocalStorageRepository
) : AuthRepository {
    
    override suspend fun verifySmsCode(
        phoneNumber: String,
        code: String
    ): Result<AuthToken> = try {
        val response = apiClient.verifySmsCode(
            SmsVerifyRequest(phoneNumber, code)
        )
        val token = response.data?.toAuthToken()
        if (token != null) {
            localStorage.save("auth_token", token)
            Result.success(token)
        } else {
            Result.failure(Exception("Invalid response"))
        }
    } catch (e: Exception) {
        Result.failure(e)
    }
}
```

## 数据流

### 单向数据流 (Unidirectional Data Flow)

```
User Action
    ↓
ViewModel.function()
    ↓
UseCase.execute()
    ↓
Repository.operation()
    ↓
Data Source (API/DB)
    ↓
Result
    ↓
Repository returns Result
    ↓
UseCase returns Result
    ↓
ViewModel updates LiveData
    ↓
UI observes and updates
```

### 示例流程

```
用户点击"登录"按钮
    ↓
LoginViewModel.login(phoneNumber, code)
    ↓
AuthUseCase.verifySmsCode(phoneNumber, code)
    ↓
AuthRepository.verifySmsCode(phoneNumber, code)
    ↓
ApiClient.verifySmsCode(request)
    ↓
HTTP POST /auth/verify-sms
    ↓
后端返回 AuthToken
    ↓
LocalStorage.save("auth_token", token)
    ↓
返回 Result.success(token)
    ↓
ViewModel._loginSuccess.value = true
    ↓
UI 观察到 loginSuccess 变化
    ↓
导航到主界面
```

## 依赖注入 (Dependency Injection)

使用 **Hilt** 进行依赖注入，提供以下优势：
- 自动生成依赖注入代码
- 减少样板代码
- 便于测试

### 配置示例

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.tingwu.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideApiClient(retrofit: Retrofit): ApiClient {
        return retrofit.create(ApiClient::class.java)
    }
}
```

## 错误处理

### Result 类型

使用 Kotlin 的 `Result` 类型处理成功和失败：

```kotlin
suspend fun verifySmsCode(phoneNumber: String, code: String): Result<AuthToken>

// 使用
authUseCase.verifySmsCode(phoneNumber, code)
    .onSuccess { token -> /* 处理成功 */ }
    .onFailure { error -> /* 处理失败 */ }
```

### 错误分类

- **网络错误**: 连接失败、超时
- **认证错误**: 无效凭证、令牌过期
- **业务错误**: 验证失败、资源不存在
- **系统错误**: 数据库错误、文件系统错误

## 异步编程

使用 **Kotlin Coroutines** 处理异步操作：

```kotlin
viewModelScope.launch {
    authUseCase.verifySmsCode(phoneNumber, code)
        .onSuccess { token ->
            _loginSuccess.value = true
        }
        .onFailure { error ->
            setError(error.message)
        }
}
```

## 测试策略

### 单元测试

测试 UseCase 和 Repository：

```kotlin
@Test
fun testVerifySmsCode_Success() = runTest {
    // Arrange
    val mockRepository = mockk<AuthRepository>()
    val useCase = AuthUseCase(mockRepository)
    val expectedToken = AuthToken("token", "refresh", 3600)
    coEvery { mockRepository.verifySmsCode(any(), any()) } returns Result.success(expectedToken)
    
    // Act
    val result = useCase.verifySmsCode("13800138000", "123456")
    
    // Assert
    assertTrue(result.isSuccess)
    assertEquals(expectedToken, result.getOrNull())
}
```

### 集成测试

测试完整的数据流：

```kotlin
@Test
fun testLoginFlow() = runTest {
    // 测试从 UI 到数据源的完整流程
    val viewModel = LoginViewModel(authUseCase)
    viewModel.login("13800138000", "123456")
    
    advanceUntilIdle()
    
    assertTrue(viewModel.loginSuccess.value == true)
}
```

## 性能优化

### 1. 内存管理
- 使用 `viewModelScope` 自动取消协程
- 及时释放大对象
- 使用对象池

### 2. 网络优化
- 请求合并和去重
- 响应缓存
- 压缩传输

### 3. 数据库优化
- 使用索引
- 批量操作
- 异步查询

## 安全性

### 1. 数据加密
- 敏感数据使用 AES-256 加密
- 令牌存储在 Android Keystore

### 2. 网络安全
- HTTPS 通信
- 证书固定
- 请求签名

### 3. 代码安全
- 代码混淆
- 反调试保护
- 敏感数据日志过滤

## 扩展性

### 添加新功能

1. **创建 Domain 层**
   ```kotlin
   // core/feature/domain/FeatureUseCase.kt
   class FeatureUseCase @Inject constructor(
       private val repository: FeatureRepository
   ) { ... }
   ```

2. **创建 Data 层**
   ```kotlin
   // core/feature/data/FeatureRepository.kt
   interface FeatureRepository { ... }
   
   // core/feature/data/FeatureRepositoryImpl.kt
   class FeatureRepositoryImpl @Inject constructor(...) : FeatureRepository { ... }
   ```

3. **创建 Presentation 层**
   ```kotlin
   // ui/feature/presentation/FeatureViewModel.kt
   @HiltViewModel
   class FeatureViewModel @Inject constructor(
       private val useCase: FeatureUseCase
   ) : BaseViewModel() { ... }
   ```

4. **配置依赖注入**
   ```kotlin
   // app/di/FeatureModule.kt
   @Module
   @InstallIn(SingletonComponent::class)
   object FeatureModule { ... }
   ```

## 最佳实践

1. **单一职责原则**: 每个类只负责一个功能
2. **依赖倒置**: 依赖抽象而不是具体实现
3. **不可变性**: 优先使用 `val` 和 `data class`
4. **类型安全**: 充分利用 Kotlin 的类型系统
5. **错误处理**: 显式处理所有可能的错误
6. **测试驱动**: 先写测试再写实现
7. **代码审查**: 定期进行代码审查

## 参考资源

- [Android Architecture Components](https://developer.android.com/topic/architecture)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [MVVM Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [Kotlin Coroutines](https://kotlinlang.org/docs/coroutines-overview.html)
- [Hilt Dependency Injection](https://dagger.dev/hilt/)
