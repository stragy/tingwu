plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.ui.common"
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

    buildFeatures {
        viewBinding = true
        dataBinding = true
    }
}

dependencies {
    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")
    implementation("androidx.appcompat:appcompat:${property("ANDROIDX_APPCOMPAT_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")

    // Material Design 3
    implementation("com.google.android.material:material:1.11.0")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
}
