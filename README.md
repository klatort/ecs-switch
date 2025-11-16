# Huawei Cloud ECS Manager

Fast desktop application for managing Huawei Cloud ECS instances with TypeScript + Electron.

## Features

- 🚀 **Instant Startup** - V8 compile cache & lazy loading for sub-2s launch times
- 🌍 **Multi-Region Support** - Manages servers across all Huawei Cloud regions
- 🔒 **Security Group Management** - One-click IP access control with visual feedback
- 🎨 **Modern UI** - Dark theme with frameless window and custom controls
- 💾 **Secure Credentials** - Encrypted storage using electron-store
- ⚡ **Real-time Status** - Live server status updates with emoji indicators

## Quick Start

### Installation

```bash
git clone https://github.com/klatort/ecs-switch.git
cd ecs-switch
npm install
```

### Development

```bash
npm start              # Run in development mode
npm run build:watch    # Watch TypeScript changes
```

### Production Build

```bash
npm run build:win      # Windows (optimized dir format)
npm run build:mac      # macOS
npm run build:linux    # Linux
```

Built executable will be in `out/win-unpacked/ecs-switch.exe` (Windows)

## Setup

1. Get your Huawei Cloud credentials:
   - Go to [Huawei Cloud Console](https://console.huaweicloud.com)
   - Navigate to **My Credentials** → **Access Keys**
   - Create or copy your Access Key ID and Secret Access Key

2. Launch the app and enter your credentials

3. The app will automatically discover servers in all configured regions

## Usage

### Server Management
- Select a server from the dropdown (grouped by region)
- Use the **Ignition Button** to start/stop servers
- Status indicators: 🟢 Running | 🔴 Stopped | 🟠 Transitioning

### IP Access Control
- Click the **IP Access** button to add/remove security group rules
- 🔒 Locked = No access | 🔓 Unlocked = IP allowed
- Independent of server state - can be toggled anytime

### Region Configuration
Optimize startup time by configuring preferred regions in `src/shared/config.ts`:

```typescript
regions: {
  preferredRegions: ['sa-peru-1', 'la-south-2'] // Only check specific regions
  // or
  preferredRegions: null // Check all 18 regions (slower)
}
```

## Project Structure

```
ecs-switch/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts         # Entry point with V8 optimization
│   │   ├── preload.ts       # Context bridge
│   │   └── services/        # Business logic
│   │       ├── huawei-cloud.service.ts  # Huawei SDK integration
│   │       └── logger.service.ts        # Logging
│   ├── renderer/            # UI layer
│   │   ├── views/          # HTML pages
│   │   ├── scripts/        # TypeScript UI logic
│   │   └── styles/         # CSS
│   └── shared/             # Shared config & types
├── dist/                   # Compiled JavaScript
├── out/                    # Built executables
└── build/                  # Build assets (icons)
```

## Performance Optimizations

- **V8 Compile Cache**: 30-50% faster startup on subsequent launches
- **Lazy SDK Loading**: Huawei Cloud SDK loaded only when needed
- **Background Validation**: Non-blocking credential checks
- **Optimized Region Queries**: Configurable region filtering
- **OnDir Build**: No extraction overhead for instant startup

## Configuration

Edit `src/shared/config.ts` to customize:

- Window dimensions
- API timeouts
- Refresh intervals
- Security group settings
- Region preferences

## Technology Stack

- **Electron 28** - Desktop framework
- **TypeScript 5.9** - Type-safe development
- **Huawei Cloud SDK** - Official Node.js SDK for ECS/VPC
- **electron-store** - Encrypted credential storage
- **v8-compile-cache** - Startup optimization

## Development

### TypeScript Compilation

```bash
npm run build:ts       # Compile once
npm run build:watch    # Watch mode
```

### Scripts

- `npm start` - Compile & run in development
- `npm run dev` - Run with development flags
- `npm run build` - Build for all platforms
- `npm run pack` - Create portable package

## Troubleshooting

**Slow startup?**
- Reduce regions in config.ts
- Check if antivirus is scanning the app
- Ensure V8 cache is enabled (should be automatic)

**Server list not loading?**
- Verify credentials are correct
- Check network connectivity to Huawei Cloud
- Press F12 to open DevTools and check console logs

**Security group errors?**
- Ensure your account has VPC permissions
- Check if the server has existing security groups
- Wait 5 seconds between add/remove operations

## License

MIT

## Contributing

Pull requests welcome! Please ensure TypeScript compiles without errors (`npx tsc`).

