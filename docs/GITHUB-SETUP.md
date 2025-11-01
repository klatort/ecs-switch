# GitHub Repository Setup Guide

## Quick Setup

Your project has been reorganized and initialized with Git. Follow these steps to push it to GitHub:

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Fill in the details:
   - **Repository name**: `ecs-switch` (or your preferred name)
   - **Description**: "Desktop application to manage Huawei Cloud ECS instances"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

### 2. Link Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ecs-switch.git

# Or if you prefer SSH:
git remote add origin git@github.com:YOUR_USERNAME/ecs-switch.git

# Verify remote was added
git remote -v

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### 3. Update README Links

After pushing to GitHub, update these placeholder links in `README.md`:

```markdown
# Change this:
git clone https://github.com/yourusername/ecs-switch.git

# To this:
git clone https://github.com/YOUR_ACTUAL_USERNAME/ecs-switch.git
```

Also update support links:
- Bug Reports: `https://github.com/YOUR_USERNAME/ecs-switch/issues`
- Feature Requests: `https://github.com/YOUR_USERNAME/ecs-switch/issues`

### 4. Configure Repository Settings

On GitHub, go to your repository → **Settings**:

#### General
- ✅ Issues (enable for bug tracking)
- ✅ Wikis (optional - for documentation)
- ✅ Discussions (optional - for community Q&A)

#### Topics
Add relevant topics to help others discover your project:
- `electron`
- `huawei-cloud`
- `ecs`
- `desktop-app`
- `cloud-management`
- `nodejs`
- `javascript`

#### About Section
Add a description and website URL (if applicable)

### 5. Add a Repository Banner (Optional)

Create a banner image and add it to your README:

```markdown
<p align="center">
  <img src="docs/banner.png" alt="Huawei Cloud ECS Manager" />
</p>
```

### 6. Create GitHub Releases

When you're ready to release a version:

1. Go to **Releases** → **Create a new release**
2. Create a tag (e.g., `v1.0.0`)
3. Add release notes
4. Upload built binaries (optional)

### 7. Set Up GitHub Actions (Optional)

Create `.github/workflows/build.yml` for automated builds:

```yaml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
```

## Current Git Status

✅ Repository initialized
✅ Initial commit created with reorganized structure
✅ Clean directory structure with proper separation
✅ All old duplicate files removed
✅ Documentation files in place
✅ .gitignore configured

## Commit History

- **Initial commit**: Reorganized project structure for maintainability
- **Cleanup commit**: Removed old duplicate files after reorganization

## Branch Strategy

### Recommended Workflow

```
main (stable)
  └── develop (active development)
       ├── feature/new-feature
       ├── fix/bug-fix
       └── docs/documentation-update
```

### Creating Feature Branches

```bash
# Create and switch to new branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push -u origin feature/my-new-feature
```

## Protecting Your Main Branch

On GitHub:
1. Go to **Settings** → **Branches**
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

## Useful Git Commands

```bash
# Check repository status
git status

# View commit history
git log --oneline --graph

# Create new branch
git checkout -b feature/my-feature

# Stage all changes
git add .

# Commit with message
git commit -m "type: description"

# Push to GitHub
git push

# Pull latest changes
git pull

# View remotes
git remote -v
```

## Commit Message Conventions

Use conventional commits for better changelog generation:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: Add batch server operations
fix: Correct security group cleanup timing
docs: Update installation instructions
refactor: Extract API calls to service layer
```

## Next Steps

1. [ ] Push repository to GitHub
2. [ ] Update README.md with actual GitHub URLs
3. [ ] Add repository topics/tags
4. [ ] Create first GitHub release
5. [ ] Set up branch protection rules
6. [ ] Consider adding GitHub Actions for CI/CD
7. [ ] Add screenshots to README
8. [ ] Create GitHub issue templates
9. [ ] Set up project board for task tracking
10. [ ] Add badges to README (build status, downloads, etc.)

## Useful Resources

- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Choose a License](https://choosealicense.com/)
