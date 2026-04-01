pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TingwuApp"
include(":app")
include(":core:auth")
include(":core:audio")
include(":core:offline-sync")
include(":core:session")
include(":core:push-notification")
include(":core:storage")
include(":core:network")
include(":core:evaluation")
include(":ui:common")
include(":ui:auth")
include(":ui:practice")
include(":ui:home")
