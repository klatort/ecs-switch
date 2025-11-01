# Project Structure Guide

## Overview

This document describes the reorganized, maintainable structure of the Huawei Cloud ECS Manager application.

## Directory Structure

```
ecs-switch/
├── .github/                      # GitHub configuration
│   └── copilot-instructions.md   # GitHub Copilot instructions
│
├── .vscode/                      # VSCode configuration
│   └── tasks.json                # Build/run tasks
│
├── build/                        # Build assets (icons, resources)
│   ├── icon.ico                  # Windows icon
│   ├── icon.icns                 # macOS icon
│   └── icon.png                  # Linux icon
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Architecture overview
│   ├── TODO.md                   # Development todos
│   └── RELEASE-v1.0.2.md         # Release notes
│
├── src/                          # Source code
│   ├── main/                     # Main process (Electron backend)
│   │   ├── index.js              # Main entry point (window, IPC handlers)
│   │   ├── preload.js            # Preload script (context bridge)
│   │   └── services/             # Backend services
│   │       └── huawei-cloud.service.js  # Huawei Cloud API wrapper
│   │
│   ├── renderer/                 # Renderer process (UI)
│   │   ├── views/                # HTML templates
│   │   │   ├── login.html        # Authentication view
│   │   │   └── main.html         # Server management view
│   │   ├── scripts/              # Frontend JavaScript
│   │   │   ├── login.js          # Login view logic
│   │   │   └── main.js           # Main view logic
│   │   └── styles/               # CSS stylesheets
│   │       ├── login.css         # Login view styles
│   │       └── main.css          # Main view styles
│   │
│   └── shared/                   # Shared utilities (used by both processes)
│       ├── constants.js          # Application constants
│       ├── state-manager.js      # State persistence helpers
│       └── ui-helpers.js         # UI utility functions
│
├── .gitignore                    # Git ignore rules
├── CONTRIBUTING.md               # Contribution guidelines
├── LICENSE                       # MIT License
├── package.json                  # NPM dependencies and scripts
├── package-lock.json             # Locked dependency versions
└── README.md                     # Project documentation
```

## Key Architectural Decisions

### 1. **Separation of Concerns**

- **`src/main/`**: Electron main process, handles system-level operations, IPC, and API calls
- **`src/renderer/`**: UI layer, handles user interactions and display
- **`src/shared/`**: Common utilities shared between main and renderer processes

### 2. **Service Layer**

The `src/main/services/` directory contains business logic services:
- `huawei-cloud.service.js`: Encapsulates all Huawei Cloud API interactions
- Future services can be added here (e.g., `auth.service.js`, `storage.service.js`)

### 3. **IPC Communication**

- **Main Process** (`src/main/index.js`): Defines IPC handlers using `ipcMain.handle()`
- **Preload Script** (`src/main/preload.js`): Exposes safe APIs to renderer via `contextBridge`
- **Renderer Process** (`src/renderer/scripts/*.js`): Calls APIs via `window.electronAPI`

### 4. **State Management**

- **Persistent State**: Uses `electron-store` for encrypted credential storage
- **Runtime State**: localStorage in renderer for UI state (security groups, operations)
- **State Helpers**: `src/shared/state-manager.js` provides state utilities

## File Responsibilities

### Main Process Files

| File | Purpose |
|------|---------|
| `src/main/index.js` | App lifecycle, window creation, IPC handlers |
| `src/main/preload.js` | Secure bridge between main and renderer |
| `src/main/services/huawei-cloud.service.js` | Huawei Cloud SDK wrapper |

### Renderer Process Files

| File | Purpose |
|------|---------|
| `src/renderer/views/login.html` | Login UI structure |
| `src/renderer/views/main.html` | Main app UI structure |
| `src/renderer/scripts/login.js` | Login view logic |
| `src/renderer/scripts/main.js` | Main view logic (server management) |
| `src/renderer/styles/login.css` | Login view styling |
| `src/renderer/styles/main.css` | Main view styling |

### Shared Files

| File | Purpose |
|------|---------|
| `src/shared/constants.js` | App-wide constants (timeouts, API limits) |
| `src/shared/state-manager.js` | State persistence utilities |
| `src/shared/ui-helpers.js` | Reusable UI functions |

## Module Import Patterns

### Main Process Imports
```javascript
// In src/main/index.js
const { validateCredentials } = require('./services/huawei-cloud.service');

// In src/main/services/huawei-cloud.service.js
const { EcsClient } = require('@huaweicloud/huaweicloud-sdk-ecs');
```

### Renderer Process Imports
```javascript
// In src/renderer/scripts/main.js
// Access IPC via preload-exposed API
const result = await window.electronAPI.getServers();
```

## Build Configuration

The `package.json` specifies:
- **Main entry**: `src/main/index.js`
- **Files to include**: `src/**/*` (all source files)

## Adding New Features

### Adding a New Service

1. Create `src/main/services/my-service.service.js`
2. Export functions from the service
3. Import in `src/main/index.js`
4. Add IPC handlers if needed
5. Expose in `src/main/preload.js` if renderer needs access

### Adding a New View

1. Create `src/renderer/views/my-view.html`
2. Create `src/renderer/scripts/my-view.js`
3. Create `src/renderer/styles/my-view.css`
4. Add navigation logic in main process or existing views

### Adding Shared Utilities

1. Create file in `src/shared/` (e.g., `src/shared/validators.js`)
2. Export functions
3. Import in both main and renderer as needed

## Migration Notes

### Old Structure → New Structure

| Old Location | New Location | Notes |
|--------------|--------------|-------|
| `main.js` | `src/main/index.js` | Main entry point |
| `preload.js` | `src/main/preload.js` | Moved to main/ |
| `src/huawei-api.js` | `src/main/services/huawei-cloud.service.js` | Better naming |
| `src/views/*.html` | `src/renderer/views/*.html` | Logical grouping |
| `src/scripts/*.js` | `src/renderer/scripts/*.js` | Logical grouping |
| `src/styles/*.css` | `src/renderer/styles/*.css` | Logical grouping |
| `src/utils/*.js` | `src/shared/*.js` | Shared utilities |
| `src/config/constants.js` | `src/shared/constants.js` | Shared config |
| `ARCHITECTURE.md` | `docs/ARCHITECTURE.md` | Documentation |
| `TODO.md` | `docs/TODO.md` | Documentation |

## Best Practices

1. **Keep main process lean**: Move business logic to services
2. **Use services for API calls**: Don't call APIs directly from IPC handlers
3. **Validate inputs**: Always validate data before API calls
4. **Handle errors gracefully**: Return structured error objects
5. **Use constants**: Define magic numbers/strings in `src/shared/constants.js`
6. **Document complex logic**: Add comments for non-obvious code
7. **Follow naming conventions**:
   - Services: `*.service.js`
   - Views: `*.html`
   - Scripts: `*.js`
   - Styles: `*.css`

## Security Considerations

1. **Context isolation**: Always enabled in `BrowserWindow`
2. **Node integration**: Always disabled for renderer
3. **Credential storage**: Always encrypted via `electron-store`
4. **IPC validation**: Validate all IPC input parameters
5. **No inline scripts**: All JavaScript in separate files

## Performance Tips

1. **Lazy loading**: Load views only when needed
2. **Debouncing**: Debounce frequent operations (status checks)
3. **Caching**: Cache API responses when appropriate
4. **Background operations**: Use timeouts for long-running tasks
5. **Memory management**: Clean up event listeners on view unload

## Troubleshooting Structure Issues

### App won't start
- Check `package.json` main field points to `src/main/index.js`
- Verify all import paths are updated to new structure

### IPC calls fail
- Ensure preload script is in `src/main/preload.js`
- Check `BrowserWindow` preload path is correct

### Missing modules
- Run `npm install` to ensure all dependencies are installed
- Check import paths match actual file locations