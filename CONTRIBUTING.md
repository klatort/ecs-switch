# Contributing to Huawei Cloud ECS Manager

Thank you for your interest in contributing to this project! 🎉

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Run the app in development**: `npm start`
4. **Make your changes** in a new branch

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Huawei Cloud account with valid Access Key ID and Secret Access Key

### Project Structure
```
ecs-switch/
├── src/
│   ├── main/               # Electron main process
│   │   ├── index.js        # Main entry point
│   │   ├── preload.js      # Preload script
│   │   └── services/       # Backend services
│   ├── renderer/           # Electron renderer process
│   │   ├── views/          # HTML templates
│   │   ├── scripts/        # Frontend JavaScript
│   │   └── styles/         # CSS stylesheets
│   └── shared/             # Shared utilities and constants
├── docs/                   # Documentation
└── build/                  # Build assets (icons, etc.)
```

## Development Guidelines

### Code Style
- Use 2 spaces for indentation
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns

### Commit Messages
Use clear and descriptive commit messages:
- `feat: Add new feature`
- `fix: Fix bug in server status`
- `docs: Update README`
- `refactor: Reorganize file structure`
- `style: Format code`
- `test: Add tests`

### Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Test thoroughly** before submitting
3. **Describe your changes** clearly in the PR description
4. **Reference any related issues**

## Testing

Before submitting a PR:
- Test the app with `npm start`
- Verify all features work as expected
- Test on your target platform (Windows/Mac/Linux)
- Check the console for errors

## Reporting Bugs

When reporting bugs, include:
- **Description** of the issue
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment** (OS, Electron version, etc.)

## Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Describe the feature clearly
- Explain why it would be useful
- Provide examples if possible

## Questions?

Feel free to open an issue for questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
