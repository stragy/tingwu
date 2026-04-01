plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.core.network"
    compileSdk = 34

    defaultConfig {
        minSdk = 24
        targetSdk = 34
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")

    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:${property("RETROFIT_VERSION")}")
    implementation("com.squareup.retrofit2:converter-gson:${property("RETROFIT_VERSION")}")

    // OkHttp
    implementation("com.squareup.okhttp3:okhttp:${property("OKHTTP_VERSION")}")
    implementation("com.squareup.okhttp3:logging-interceptor:${property("OKHTTP_VERSION")}")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")

    // Gson
    implementation("com.google.code.gson:gson:${property("GSON_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
    testImplementation("io.mockk:mockk:${property("MOCKK_VERSION")}")
}
