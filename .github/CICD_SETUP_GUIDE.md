# CI/CD Setup Guide for Tingwu Android App

This guide provides step-by-step instructions to set up and configure the GitHub Actions CI/CD pipeline for the Tingwu Android application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Signing Configuration](#signing-configuration)
4. [Firebase Configuration](#firebase-configuration)
5. [Workflow Customization](#workflow-customization)
6. [Testing the Workflows](#testing-the-workflows)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- GitHub repository with Actions enabled
- Android project with Gradle build system
- JDK 17 or higher
- Android SDK (API 34)
- Git installed locally

## Initial Setup

### Step 1: Enable GitHub Actions

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Actions** → **General**
3. Under "Actions permissions", select **Allow all actions and reusable workflows**
4. Click **Save**

### Step 2: Verify Workflow Files

The following workflow files should be present in `.github/workflows/`:

```
.github/workflows/
├── build.yml              # Main build workflow
├── test.yml               # Unit and instrumented tests
├── code-quality.yml       # Lint, Detekt, ktlint checks
├── release.yml            # Release build and distribution
└── README.md              # Workflow documentation
```

### Step 3: Configure Branch Protection Rules (Optional)

1. Go to **Settings** → **Branches**
2. Add a branch protection rule for `main` and `develop`
3. Require status checks to pass before merging:
   - Build
   - Unit Tests
   - Instrumented Tests
   - Lint
   - Detekt
   - ktlint

## Signing Configuration

### Step 1: Generate Signing Key

If you don't have a signing key, generate one:

```bash
# Navigate to your project directory
cd android

# Generate keystore (valid for 10000 days)
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias tingwu \
  -keypass YOUR_KEY_PASSWORD \
  -storepass YOUR_STORE_PASSWORD

# Verify the keystore
keytool -list -v -keystore release.keystore -storepass YOUR_STORE_PASSWORD
```

### Step 2: Encode Keystore to Base64

```bash
# On macOS/Linux
base64 -i release.keystore -o release.keystore.b64

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Out-File release.keystore.b64

# Display the Base64 content
cat release.keystore.b64
```

### Step 3: Add Secrets to GitHub

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Secret Name | Value |
|---|---|
| `SIGNING_KEY` | Base64-encoded keystore content |
| `SIGNING_KEY_ALIAS` | `tingwu` (or your alias) |
| `SIGNING_KEY_STORE_PASSWORD` | Your keystore password |
| `SIGNING_KEY_PASSWORD` | Your key password |

**Example**:
```
SIGNING_KEY: MIIJpAIBAAKCAgEA2x5...
SIGNING_KEY_ALIAS: tingwu
SIGNING_KEY_STORE_PASSWORD: myStorePassword123
SIGNING_KEY_PASSWORD: myKeyPassword123
```

### Step 4: Secure the Keystore

```bash
# Remove the keystore from local directory after uploading to GitHub
rm release.keystore release.keystore.b64

# Add to .gitignore
echo "*.keystore" >> .gitignore
echo "*.keystore.b64" >> .gitignore
```

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project**
3. Enter project name: `tingwu-android`
4. Enable Google Analytics (optional)
5. Click **Create project**

### Step 2: Add Android App to Firebase

1. In Firebase Console, click **Add app** → **Android**
2. Enter package name: `com.tingwu.app`
3. Enter SHA-1 certificate fingerprint:
   ```bash
   # Get SHA-1 from your keystore
   keytool -list -v -keystore release.keystore -storepass YOUR_STORE_PASSWORD | grep SHA1
   ```
4. Click **Register app**
5. Download `google-services.json`
6. Place it in `android/app/` directory

### Step 3: Create Service Account

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file

### Step 4: Encode Service Account JSON

```bash
# On macOS/Linux
base64 -i service-account.json -o service-account.json.b64

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json")) | Out-File service-account.json.b64

# Display the Base64 content
cat service-account.json.b64
```

### Step 5: Add Firebase Secrets to GitHub

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Secret Name | Value |
|---|---|
| `FIREBASE_APP_ID` | Your Firebase App ID |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Base64-encoded service account JSON |
| `FIREBASE_TESTERS` | Comma-separated tester emails |

**Example**:
```
FIREBASE_APP_ID: 1:123456789:android:abcdef1234567890
FIREBASE_SERVICE_ACCOUNT_JSON: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIs...
FIREBASE_TESTERS: tester1@example.com,tester2@example.com
```

### Step 6: Secure Service Account

```bash
# Remove the service account from local directory
rm service-account.json service-account.json.b64

# Add to .gitignore
echo "service-account.json" >> .gitignore
```

## Workflow Customization

### Build Workflow

Edit `.github/workflows/build.yml` to customize:

```yaml
# Change build variants
- name: Build debug APK
  run: |
    cd android
    ./gradlew assembleDebug --stacktrace

# Add custom build parameters
- name: Build with custom properties
  run: |
    cd android
    ./gradlew assembleRelease \
      -Pbuild.version=1.0.0 \
      -Pbuild.timestamp=$(date +%s)
```

### Test Workflow

Edit `.github/workflows/test.yml` to customize:

```yaml
# Change emulator configuration
- name: Run instrumented tests
  uses: reactivecircus/android-emulator-runner@v2
  with:
    api-level: 33  # Change API level
    target: google_apis_playstore  # Change target
    arch: arm64-v8a  # Change architecture
    profile: Pixel 5  # Change device profile
```

### Code Quality Workflow

Edit `.github/workflows/code-quality.yml` to customize:

```yaml
# Add custom lint rules
- name: Run Android Lint
  run: |
    cd android
    ./gradlew lint \
      -Plint.abortOnError=true \
      -Plint.checkReleaseBuilds=true
```

### Release Workflow

Edit `.github/workflows/release.yml` to customize:

```yaml
# Change release triggers
on:
  push:
    branches: [ main, release/* ]  # Add release branches
    tags:
      - 'v*'
      - 'release-*'  # Add custom tag patterns

# Add custom release steps
- name: Create release notes
  run: |
    echo "Release notes for ${{ github.ref }}" > RELEASE_NOTES.md
```

## Testing the Workflows

### Test Build Workflow

1. Create a test branch:
   ```bash
   git checkout -b test/ci-build
   ```

2. Make a small change and push:
   ```bash
   echo "# Test" >> README.md
   git add .
   git commit -m "Test CI build"
   git push origin test/ci-build
   ```

3. Go to **Actions** tab and verify the workflow runs

### Test Release Workflow

1. Create a release tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. Go to **Actions** tab and verify the release workflow runs

### Monitor Workflow Execution

1. Go to **Actions** tab
2. Click on the workflow run
3. View logs for each job
4. Download artifacts if needed

## Troubleshooting

### Build Failures

**Issue**: `gradlew: command not found`
```bash
# Solution: Make gradlew executable
chmod +x android/gradlew
git add android/gradlew
git commit -m "Make gradlew executable"
git push
```

**Issue**: `JAVA_HOME not set`
```yaml
# Solution: Ensure JDK setup step is present
- name: Set up JDK 17
  uses: actions/setup-java@v3
  with:
    java-version: '17'
    distribution: 'temurin'
```

### Test Failures

**Issue**: `Emulator failed to start`
```yaml
# Solution: Use macOS runner and adjust configuration
runs-on: macos-latest
with:
  api-level: 31
  target: google_apis
  arch: x86_64
```

**Issue**: `Tests timeout`
```yaml
# Solution: Increase timeout
timeout-minutes: 60
```

### Signing Issues

**Issue**: `Invalid keystore format`
```bash
# Solution: Verify keystore is valid
keytool -list -v -keystore release.keystore -storepass YOUR_STORE_PASSWORD
```

**Issue**: `Alias not found`
```bash
# Solution: Check alias name
keytool -list -keystore release.keystore -storepass YOUR_STORE_PASSWORD
```

### Firebase Issues

**Issue**: `Firebase App ID not found`
```yaml
# Solution: Verify secret is set correctly
- name: Debug Firebase
  run: |
    echo "App ID: ${{ secrets.FIREBASE_APP_ID }}"
```

**Issue**: `Service account authentication failed`
```bash
# Solution: Verify service account JSON is valid
cat service-account.json | jq .
```

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Monthly
   ```bash
   cd android
   ./gradlew dependencyUpdates
   ```

2. **Review Workflow Logs**: Weekly
   - Check for warnings or errors
   - Monitor build times
   - Review test coverage

3. **Update Secrets**: Annually
   - Rotate signing keys
   - Update Firebase credentials
   - Review access permissions

### Monitoring

1. **Build Times**: Track in workflow logs
2. **Test Coverage**: Monitor in test reports
3. **Artifact Sizes**: Check APK/AAB sizes
4. **Failure Rates**: Review failed workflows

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Android Gradle Plugin](https://developer.android.com/studio/build)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Detekt Documentation](https://detekt.dev/)
- [ktlint Documentation](https://ktlint.github.io/)

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review this guide
3. Consult GitHub Actions documentation
4. Contact the development team
