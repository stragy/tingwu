plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.core.storage"
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
    implementation("androidx.room:room-runtime:${property("ANDROIDX_ROOM_VERSION")}")
    implementation("androidx.room:room-ktx:${property("ANDROIDX_ROOM_VERSION")}")
    implementation("androidx.security:security-crypto:${property("ANDROIDX_SECURITY_VERSION")}")
    implementation("androidx.datastore:datastore-preferences:${property("ANDROIDX_DATASTORE_VERSION")}")

    kapt("androidx.room:room-compiler:${property("ANDROIDX_ROOM_VERSION")}")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")

    // Gson for serialization
    implementation("com.google.code.gson:gson:${property("GSON_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
    testImplementation("io.mockk:mockk:${property("MOCKK_VERSION")}")
}
