# CI/CD Quick Start Guide

## For Developers

### Understanding the CI/CD Pipeline

The Tingwu Android app uses GitHub Actions for automated:
- ✅ Building (debug & release)
- ✅ Testing (unit & instrumented)
- ✅ Code quality checks (lint, detekt, ktlint)
- ✅ Release distribution (Firebase App Distribution)

### Workflow Triggers

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| Build | Push to main/develop, PR | Compile APK/AAB |
| Test | Push to main/develop, PR | Run tests |
| Code Quality | Push to main/develop, PR | Check code quality |
| Release | Push to main, tags v* | Build & distribute release |

### Checking Workflow Status

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. View logs for each job
4. Download artifacts if needed

### Common Tasks

#### Push Code and Trigger Workflows

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add my feature"

# Push to trigger workflows
git push origin feature/my-feature

# Create PR to trigger workflows
# Go to GitHub and create PR
```

#### Download Build Artifacts

1. Go to **Actions** tab
2. Click on the workflow run
3. Scroll to "Artifacts" section
4. Click download button

#### View Test Results

1. Go to **Actions** tab
2. Click on the workflow run
3. Click on "Test" job
4. View test results in logs
5. Download test reports from artifacts

#### Check Code Quality Issues

1. Go to **Actions** tab
2. Click on "Code Quality" workflow
3. View lint/detekt/ktlint results
4. Download reports from artifacts

### Release Process

#### Create a Release

```bash
# Create version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to trigger release workflow
git push origin v1.0.0

# Go to Actions tab to monitor release
```

#### Monitor Release Build

1. Go to **Actions** tab
2. Click on "Release" workflow
3. Monitor build progress
4. Check Firebase App Distribution for APK

### Troubleshooting

#### Build Failed

1. Check workflow logs for error message
2. Common causes:
   - Gradle configuration issue
   - Missing dependencies
   - Compilation error
3. Fix locally and push again

#### Tests Failed

1. Check test logs in workflow
2. Run tests locally:
   ```bash
   cd android
   ./gradlew test
   ```
3. Fix failing tests and push

#### Code Quality Issues

1. Check lint/detekt reports
2. Fix issues locally:
   ```bash
   cd android
   ./gradlew lint
   ./gradlew detekt
   ./gradlew ktlintFormat
   ```
3. Push fixes

### Local Development

#### Run Tests Locally

```bash
cd android

# Unit tests
./gradlew test

# Instrumented tests (requires emulator)
./gradlew connectedAndroidTest

# All tests
./gradlew test connectedAndroidTest
```

#### Run Code Quality Checks

```bash
cd android

# Lint
./gradlew lint

# Detekt
./gradlew detekt

# ktlint
./gradlew ktlintCheck

# Fix ktlint issues
./gradlew ktlintFormat
```

#### Build Locally

```bash
cd android

# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# AAB
./gradlew bundleRelease
```

### Best Practices

1. **Always run tests locally before pushing**
   ```bash
   cd android
   ./gradlew test
   ```

2. **Fix code quality issues before pushing**
   ```bash
   cd android
   ./gradlew ktlintFormat
   ./gradlew lint
   ```

3. **Use meaningful commit messages**
   ```bash
   git commit -m "Fix: Handle null pointer in AudioEngine"
   ```

4. **Create PRs for code review**
   - Push to feature branch
   - Create PR on GitHub
   - Wait for CI checks to pass
   - Request review from team

5. **Monitor CI/CD status**
   - Check Actions tab regularly
   - Fix failures promptly
   - Keep build green

### Useful Commands

```bash
# View workflow status
gh run list --repo owner/repo

# View specific workflow run
gh run view RUN_ID --repo owner/repo

# Download artifacts
gh run download RUN_ID --repo owner/repo

# View workflow logs
gh run view RUN_ID --log --repo owner/repo
```

### Documentation

- **Full Setup Guide**: See `.github/CICD_SETUP_GUIDE.md`
- **Implementation Details**: See `.github/CI_CD_IMPLEMENTATION_SUMMARY.md`
- **Workflow Documentation**: See `.github/workflows/README.md`

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review this quick start guide
3. Read full setup guide
4. Contact the development team

### Key Contacts

- **CI/CD Issues**: DevOps Team
- **Build Failures**: Development Team
- **Test Failures**: QA Team
- **Release Issues**: Release Manager

---

**Last Updated**: 2024
**Version**: 1.0
