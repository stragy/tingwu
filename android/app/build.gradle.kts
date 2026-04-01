plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
    id("com.google.gms.google-services")
    id("androidx.navigation.safeargs.kotlin")
}

if (project.hasProperty("release")) {
    plugins.apply("com.google.firebase.crashlytics")
}

android {
    namespace = "com.tingwu.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.tingwu.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            buildConfigField("String", "API_BASE_URL", "\"https://api.tingwu.com/\"")
        }
        debug {
            isMinifyEnabled = false
            // 10.0.2.2 是 Android 模拟器访问宿主机 localhost 的特殊地址
            // 如需真机调试，将此地址改为宿主机的局域网 IP（如 "http://192.168.1.x:8080/"）
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:8080/\"")
        }
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }

    buildFeatures {
        buildConfig = true
    }

    ext {
        set("crashlytics.buildId", "debug-build-id")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
        dataBinding = true
        buildConfig = true
    }
}

dependencies {
    // Core modules
    implementation(project(":core:auth"))
    implementation(project(":core:audio"))
    implementation(project(":core:offline-sync"))
    implementation(project(":core:session"))
    implementation(project(":core:push-notification"))
    implementation(project(":core:storage"))
    implementation(project(":core:network"))
    implementation(project(":core:evaluation"))
    implementation(project(":ui:common"))
    implementation(project(":ui:auth"))
    implementation(project(":ui:practice"))
    implementation(project(":ui:home"))

    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")
    implementation("androidx.appcompat:appcompat:${property("ANDROIDX_APPCOMPAT_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.work:work-runtime-ktx:${property("ANDROIDX_WORK_VERSION")}")
    implementation("androidx.datastore:datastore-preferences:${property("ANDROIDX_DATASTORE_VERSION")}")
    // Startup — needed for custom WorkManager initialization
    implementation("androidx.startup:startup-runtime:1.1.1")

    // Navigation
    implementation("androidx.navigation:navigation-fragment-ktx:${property("NAVIGATION_VERSION")}")
    implementation("androidx.navigation:navigation-ui-ktx:${property("NAVIGATION_VERSION")}")

    // Material Design 3
    implementation("com.google.android.material:material:1.11.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:${property("COROUTINES_VERSION")}")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Hilt for Dependency Injection
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")
    // Hilt WorkManager integration
    implementation("androidx.hilt:hilt-work:${property("HILT_WORK_VERSION")}")
    kapt("androidx.hilt:hilt-compiler:${property("HILT_WORK_VERSION")}")

    // Retrofit + OkHttp for API integration
    implementation("com.squareup.retrofit2:retrofit:${property("RETROFIT_VERSION")}")
    implementation("com.squareup.retrofit2:converter-gson:${property("RETROFIT_VERSION")}")
    implementation("com.squareup.okhttp3:okhttp:${property("OKHTTP_VERSION")}")
    implementation("com.squareup.okhttp3:logging-interceptor:${property("OKHTTP_VERSION")}")

    // Room database for local storage
    implementation("androidx.room:room-runtime:${property("ANDROIDX_ROOM_VERSION")}")
    implementation("androidx.room:room-ktx:${property("ANDROIDX_ROOM_VERSION")}")
    kapt("androidx.room:room-compiler:${property("ANDROIDX_ROOM_VERSION")}")

    // Firebase (Analytics, Crashlytics, FCM)
    implementation(platform("com.google.firebase:firebase-bom:${property("FIREBASE_BOM_VERSION")}"))
    implementation("com.google.firebase:firebase-messaging-ktx")
    implementation("com.google.firebase:firebase-analytics-ktx")
    // Crashlytics and Perf removed for debug builds - requires valid Firebase config
    // implementation("com.google.firebase:firebase-crashlytics-ktx")
    // implementation("com.google.firebase:firebase-perf-ktx")

    // ExoPlayer for audio playback
    implementation("androidx.media3:media3-exoplayer:${property("MEDIA3_VERSION")}")
    implementation("androidx.media3:media3-common:${property("MEDIA3_VERSION")}")

    // Security
    implementation("androidx.security:security-crypto:${property("ANDROIDX_SECURITY_VERSION")}")

    // Logging
    implementation("com.jakewharton.timber:timber:${property("TIMBER_VERSION")}")

    // LeakCanary for memory leak detection (debug only)
    debugImplementation("com.squareup.leakcanary:leakcanary-android:${property("LEAKCANARY_VERSION")}")

    // Testing - Unit Tests
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
    testImplementation("io.mockk:mockk:${property("MOCKK_VERSION")}")
    testImplementation("org.mockito.kotlin:mockito-kotlin:${property("MOCKITO_KOTLIN_VERSION")}")
    testImplementation("org.mockito:mockito-core:${property("MOCKITO_VERSION")}")

    // Testing - Instrumented Tests (Espresso)
    androidTestImplementation("androidx.test.ext:junit:${property("ANDROIDX_TEST_EXT_VERSION")}")
    androidTestImplementation("androidx.test.espresso:espresso-core:${property("ESPRESSO_VERSION")}")
}
