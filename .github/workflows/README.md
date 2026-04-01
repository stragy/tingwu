# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for the Tingwu Android application CI/CD pipeline.

## Workflows Overview

### 1. Build Workflow (`build.yml`)

**Trigger**: Push to `main`/`develop` branches, Pull Requests

**Jobs**:
- Build debug APK
- Build release APK
- Build AAB (Android App Bundle) for release
- Generate build reports
- Upload build artifacts
- Notify on build failures

**Artifacts**:
- `debug-apk`: Debug APK for testing
- `release-apk`: Release APK for distribution
- `release-aab`: AAB for Google Play Store
- `build-reports`: Gradle build reports

**Retention**: 7 days

### 2. Test Workflow (`test.yml`)

**Trigger**: Push to `main`/`develop` branches, Pull Requests

**Jobs**:

#### Unit Tests (Ubuntu)
- Runs on `ubuntu-latest`
- Executes `./gradlew test`
- Publishes test results
- Uploads test reports

#### Instrumented Tests (macOS)
- Runs on `macos-latest` with Android Emulator
- API Level: 31
- Target: google_apis
- Architecture: x86_64
- Profile: Nexus 5X
- Executes `./gradlew connectedAndroidTest`
- Publishes test results

**Artifacts**:
- `unit-test-results`: Unit test reports
- `instrumented-test-results`: Instrumented test reports

**Retention**: 7 days

### 3. Code Quality Workflow (`code-quality.yml`)

**Trigger**: Push to `main`/`develop` branches, Pull Requests

**Jobs**:

#### Android Lint
- Runs Android Lint checks
- Uploads HTML reports

#### Detekt
- Runs Detekt static analysis
- Uploads Detekt reports

#### ktlint
- Runs Kotlin linting
- Uploads ktlint reports

**Artifacts**:
- `lint-results`: Android Lint HTML reports
- `detekt-results`: Detekt analysis reports
- `ktlint-results`: ktlint reports

**Retention**: 7 days

### 4. Release Workflow (`release.yml`)

**Trigger**: 
- Push to `main` branch
- Git tags matching `v*` pattern
- Manual workflow dispatch

**Jobs**:
- Run unit tests
- Run lint checks
- Build release APK
- Build AAB
- Sign release APK (requires signing key)
- Sign AAB (requires signing key)
- Upload to Firebase App Distribution (optional)
- Create GitHub Release (for tags)
- Notify on success/failure

**Artifacts**:
- `signed-release-apk`: Signed release APK
- `signed-release-aab`: Signed AAB

**Retention**: 30 days

## Setup Instructions

### 1. Enable GitHub Actions

1. Go to your repository settings
2. Navigate to "Actions" → "General"
3. Ensure "Allow all actions and reusable workflows" is selected

### 2. Configure Secrets (for Release Workflow)

Add the following secrets to your repository:

**For APK/AAB Signing**:
- `SIGNING_KEY`: Base64-encoded keystore file
- `SIGNING_KEY_ALIAS`: Keystore alias
- `SIGNING_KEY_STORE_PASSWORD`: Keystore password
- `SIGNING_KEY_PASSWORD`: Key password

**For Firebase App Distribution** (optional):
- `FIREBASE_APP_ID`: Firebase App ID
- `FIREBASE_SERVICE_ACCOUNT_JSON`: Firebase service account JSON
- `FIREBASE_TESTERS`: Comma-separated list of tester emails

### 3. Generate Signing Key

```bash
# Generate keystore
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias tingwu

# Encode to Base64
base64 -i release.keystore -o release.keystore.b64

# Copy the content to SIGNING_KEY secret
cat release.keystore.b64
```

### 4. Configure Firebase (optional)

1. Create a Firebase project
2. Add Android app to Firebase
3. Download service account JSON
4. Encode to Base64 and add to `FIREBASE_SERVICE_ACCOUNT_JSON` secret

## Gradle Configuration

### Required Gradle Tasks

Ensure your `build.gradle.kts` files include:

```kotlin
// For lint checks
tasks.register("lint") {
    dependsOn("lintDebug", "lintRelease")
}

// For build reports
tasks.register("buildReport") {
    doLast {
        println("Build completed successfully")
    }
}
```

### Gradle Caching

The workflows use Gradle caching to speed up builds:
- Caches `~/.gradle/caches` and `~/.gradle/wrapper`
- Cache key includes `gradle-wrapper.properties` hash
- Fallback to OS-specific cache

## Performance Optimization

### Build Time Optimization

1. **Gradle Caching**: Enabled by default
2. **Parallel Builds**: Configure in `gradle.properties`:
   ```properties
   org.gradle.parallel=true
   org.gradle.caching=true
   ```

3. **Dependency Caching**: GitHub Actions caches Gradle dependencies

### Emulator Performance

- Uses `macos-latest` for faster emulator execution
- Runs on API 31 with Google APIs
- Uses x86_64 architecture for better performance

## Monitoring and Notifications

### Build Status

- Check workflow status in "Actions" tab
- View detailed logs for each job
- Download artifacts from workflow summary

### Notifications

- GitHub notifications for workflow failures
- Comments on PRs with build status
- Email notifications (configure in GitHub settings)

### Test Results

- Published test results visible in PR checks
- Detailed reports available in artifacts
- Test summary in workflow summary page

## Troubleshooting

### Build Failures

1. Check workflow logs for error messages
2. Verify Gradle configuration
3. Ensure all dependencies are available
4. Check for sufficient disk space

### Test Failures

1. Review test logs in artifacts
2. Check for flaky tests
3. Verify emulator configuration
4. Ensure test data is available

### Signing Issues

1. Verify keystore file is valid
2. Check keystore password
3. Ensure alias exists in keystore
4. Verify Base64 encoding

### Firebase Distribution Issues

1. Verify Firebase App ID
2. Check service account permissions
3. Ensure testers list is valid
4. Verify Firebase project configuration

## Best Practices

### Workflow Optimization

1. Use caching for faster builds
2. Run tests in parallel when possible
3. Fail fast on critical errors
4. Upload artifacts for debugging

### Code Quality

1. Fix lint warnings before merging
2. Maintain test coverage above 80%
3. Run Detekt regularly
4. Keep dependencies updated

### Release Management

1. Use semantic versioning (v1.0.0)
2. Create release notes for each version
3. Test release builds before publishing
4. Monitor Firebase distribution for issues

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Android Gradle Plugin Documentation](https://developer.android.com/studio/build)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Detekt Documentation](https://detekt.dev/)
- [ktlint Documentation](https://ktlint.github.io/)

## Support

For issues or questions:
1. Check workflow logs
2. Review this README
3. Consult GitHub Actions documentation
4. Contact the development team
