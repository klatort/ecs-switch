# Huawei Cloud ECS Manager - Project Setup

## Project Overview
Electron.js desktop application for managing Huawei Cloud ECS instances with authentication and server management views.

## Progress Tracking

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Desktop app for managing Huawei Cloud ECS with Electron.js
- [x] Scaffold the Project - Created complete Electron.js structure with main, preload, and renderer files
- [x] Customize the Project - Implemented authentication view, server management view with Ignition Button UI, and Huawei Cloud SDK integration
- [x] Install Required Extensions - No extensions needed
- [x] Compile the Project - Dependencies installed successfully
- [x] Create and Run Task - Run with 'npm start'
- [ ] Launch the Project - Ready to launch
- [x] Ensure Documentation is Complete - README.md created with complete setup and usage instructions

## Development Rules
- Use '.' as the working directory
- Keep UI clean and modern with dark theme
- Handle all API errors gracefully with user-friendly messages
- Store credentials securely using electron-store with encryption
- Auto-refresh server status every 30 seconds
- Auto-refresh quotas every 5 minutes

## Project Structure
- main.js - Electron main process with IPC handlers
- preload.js - Context bridge for secure IPC communication
- src/huawei-api.js - Huawei Cloud SDK integration
- src/views/ - HTML views (login, main)
- src/styles/ - CSS stylesheets
- src/scripts/ - Renderer process JavaScript

## Key Features Implemented
✅ Secure credential storage with encryption
✅ Automatic credential validation and bypass on subsequent launches
✅ Single dropdown showing all servers from all regions
✅ Creative "Ignition Button" UI with state-based colors and animations
✅ Real-time server status display and updates
✅ Account quota monitoring with refresh capability
✅ Error handling with user-friendly messages
