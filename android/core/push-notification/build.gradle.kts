plugins {
    id("com.android.library")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.tingwu.core.push_notification"
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
    implementation(project(":core:auth"))

    // AndroidX
    implementation("androidx.core:core-ktx:${property("ANDROIDX_CORE_VERSION")}")

    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:${property("FIREBASE_BOM_VERSION")}"))
    implementation("com.google.firebase:firebase-messaging-ktx")

    // Hilt
    implementation("com.google.dagger:hilt-android:${property("HILT_VERSION")}")
    kapt("com.google.dagger:hilt-compiler:${property("HILT_VERSION")}")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${property("COROUTINES_VERSION")}")
    // Firebase Tasks to Coroutines bridge (provides .await() on Task<T>)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-play-services:${property("COROUTINES_VERSION")}")

    // Testing
    testImplementation("junit:junit:${property("JUNIT_VERSION")}")
    testImplementation("io.mockk:mockk:${property("MOCKK_VERSION")}")
}
