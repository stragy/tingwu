plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.core.evaluation"
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
    implementation(project(":core:network"))

    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")

    // OkHttp (for multipart audio upload)
    implementation("com.squareup.okhttp3:okhttp:${property("OKHTTP_VERSION")}")

    // Retrofit converter (for RequestBody)
    implementation("com.squareup.retrofit2:retrofit:${property("RETROFIT_VERSION")}")

    // Room
    implementation("androidx.room:room-runtime:${property("ANDROIDX_ROOM_VERSION")}")
    implementation("androidx.room:room-ktx:${property("ANDROIDX_ROOM_VERSION")}")
    kapt("androidx.room:room-compiler:${property("ANDROIDX_ROOM_VERSION")}")

    // Gson (for Room TypeConverters)
    implementation("com.google.code.gson:gson:${property("GSON_VERSION")}")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
}
