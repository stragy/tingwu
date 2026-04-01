plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.core.offline_sync"
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

kapt {
    javacOptions {
        option("-source", "17")
        option("-target", "17")
    }
    arguments {
        arg("room.schemaLocation", "$projectDir/schemas")
    }
}

dependencies {
    implementation(project(":core:storage"))
    implementation(project(":core:network"))

    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")
    implementation("androidx.work:work-runtime-ktx:${property("ANDROIDX_WORK_VERSION")}")

    // Room（本模块自建 SyncDatabase/SyncDao/SyncEntity，需要独立的 room-compiler 做注解处理）
    implementation("androidx.room:room-runtime:${property("ANDROIDX_ROOM_VERSION")}")
    implementation("androidx.room:room-ktx:${property("ANDROIDX_ROOM_VERSION")}")
    kapt("androidx.room:room-compiler:${property("ANDROIDX_ROOM_VERSION")}")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")
    // Hilt WorkManager integration
    implementation("androidx.hilt:hilt-work:${property("HILT_WORK_VERSION")}")
    kapt("androidx.hilt:hilt-compiler:${property("HILT_WORK_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
    testImplementation("io.mockk:mockk:${property("MOCKK_VERSION")}")
}
