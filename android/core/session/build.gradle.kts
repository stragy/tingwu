plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.core.session"
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
    implementation(project(":core:storage"))
    implementation(project(":core:network"))

    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:${property("ANDROIDX_LIFECYCLE_VERSION")}")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
    testImplementation("io.mockk:mockk:${property("MOCKK_VERSION")}")
}
