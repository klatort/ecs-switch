# Huawei Cloud ECS Manager# 🚀 Huawei Cloud ECS Manager# Huawei Cloud ECS Manager



Desktop application to manage Huawei Cloud ECS instances. Start and stop servers with a simple, visual interface.



![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)> A modern, Electron-based desktop application for managing Huawei Cloud Elastic Cloud Server (ECS) instances with an intuitive interface.A modern desktop application for managing Huawei Cloud Elastic Cloud Server (ECS) instances. Start, stop, and monitor your cloud servers with an intuitive, visually engaging interface.

![License](https://img.shields.io/badge/license-MIT-green)



## Features

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)

- 🌍 View all ECS instances across all regions

- ⚡ Start/stop servers with one click![Electron](https://img.shields.io/badge/electron-28.0.0-brightgreen)![Electron](https://img.shields.io/badge/electron-28.0.0-brightgreen)

- 🔐 Secure encrypted credential storage

- 🌐 Automatic temporary security group creation for remote access![License](https://img.shields.io/badge/license-MIT-green)![License](https://img.shields.io/badge/license-MIT-green)

- 📊 Real-time server status monitoring

![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

## Prerequisites

## Features

- **Node.js** v16+ ([Download](https://nodejs.org/))

- **Huawei Cloud Account** with ECS access## ✨ Features

- **Access Keys** ([Get them here](https://console.huaweicloud.com))

### 🔐 Secure Authentication

## Quick Start

### 🔐 Secure Authentication- Secure credential storage using encrypted local storage

```bash

# Clone the repository- 🔒 Encrypted local credential storage- Automatic credential validation

git clone https://github.com/klatort/ecs-switch.git

cd ecs-switch- ✅ Automatic credential validation- One-time setup with persistent login



# Install dependencies- 💾 Persistent login (no re-authentication needed)

npm install

### 🖥️ Server Management

# Run the application

npm start### 🖥️ Server Management- View all ECS instances across all regions in a single dropdown

```

- 🌍 View all ECS instances across **all regions** in one place- Real-time server status monitoring

## Usage

- ⚡ Real-time server status monitoring (auto-refresh every 30s)- Intuitive "Ignition Button" control interface with visual feedback

### First Launch

- 🎮 Intuitive "Ignition Button" interface with visual state feedback- Start and stop servers with a single click

1. Enter your Huawei Cloud **Access Key ID** and **Secret Access Key**

2. Click **Login**- 🔄 Start/stop servers with a single click- Automatic status updates every 30 seconds

3. Your credentials are encrypted and stored locally

- 🌐 Automatic temporary security group creation for remote access

### Managing Servers

### 📊 Resource Monitoring

1. **Select a server** from the dropdown (shows all regions)

2. **Click the Ignition Button** to start/stop the server### 📊 Resource Monitoring- Real-time account quota display (vCPUs, Memory, Instances)

   - 🔴 Red = Stopped (click to start)

   - 🟢 Green = Running (click to stop)- 📈 Real-time account quota display (vCPUs, Memory, Instances)- Auto-refresh every 5 minutes

   - 🟡 Yellow = Operation in progress

- 🔄 Auto-refresh every 5 minutes- Manual refresh on demand

### Auto-IP Feature

- 🔃 Manual refresh on demand

Toggle "Auto-IP" to automatically:

- Create temporary security group on start### 🎨 Modern UI

- Grant your current IP address SSH/RDP access

- Remove security group when stopping### 🎨 Modern UI- Clean, dark-themed interface



### Keyboard Shortcuts- 🌙 Clean, dark-themed interface- Animated controls with visual state indicators



- **F12** - Open DevTools for debugging- ✨ Animated controls with visual state indicators- Responsive design

- **ESC** - Close application

- 📱 Responsive design- Smooth transitions and feedback

## Building for Distribution

- 🎭 Smooth transitions and feedback

```bash

# Build for all platforms## Prerequisites

npm run build

## 📋 Prerequisites

# Build for specific platform

npm run build:win    # Windows- **Node.js** (v16 or higher)

npm run build:mac    # macOS

npm run build:linux  # Linux- **Node.js** v16 or higher ([Download](https://nodejs.org/))- **npm** (v7 or higher)

```

- **npm** v7 or higher (comes with Node.js)- **Huawei Cloud Account** with ECS access

Built applications will be in the `dist/` folder.

- **Huawei Cloud Account** with ECS access- **Access Key ID** and **Secret Access Key** from Huawei Cloud

## Project Structure

- **Access Key ID** and **Secret Access Key** from Huawei Cloud

```

ecs-switch/## Installation

├── src/

│   ├── main/           # Electron main process## 🚀 Quick Start

│   ├── renderer/       # UI components

│   └── shared/         # Shared utilities1. **Clone or download this repository**

├── build/              # Build assets (icons)

└── docs/               # Documentation### Installation   ```bash

```

   git clone <repository-url>

## Configuration

```bash   cd huawei-cloud-ecs-manager

Get your Huawei Cloud credentials:

1. Log in to [Huawei Cloud Console](https://console.huaweicloud.com)# Clone the repository   ```

2. Click your username → **My Credentials**

3. Go to **Access Keys** → **Create Access Key**git clone https://github.com/yourusername/ecs-switch.git

4. Download and save securely

cd ecs-switch2. **Install dependencies**

⚠️ **Never share or commit your Secret Access Key!**

   ```bash

## Troubleshooting

# Install dependencies   npm install

**Invalid credentials error**

- Verify Access Key ID and Secret Access Key are correctnpm install   ```

- Check your Huawei Cloud account has ECS permissions



**No servers found**

- Ensure you have ECS instances in your account# Run the application## Configuration

- Check servers exist in supported regions

npm start

**Application won't start**

```bash```### Getting Your Huawei Cloud Credentials

# Check Node.js version

node --version  # Should be v16+



# Reinstall dependencies### Getting Huawei Cloud Credentials1. Log in to [Huawei Cloud Console](https://console.huaweicloud.com)

rm -rf node_modules package-lock.json

npm install2. Click on your username in the top-right corner

```

1. Log in to [Huawei Cloud Console](https://console.huaweicloud.com)3. Select **My Credentials**

## Development

2. Click on your username → **My Credentials**4. Navigate to **Access Keys** tab

```bash

npm start          # Run in development3. Navigate to **Access Keys** tab5. Click **Create Access Key**

npm run dev        # Run with dev flag

```4. Click **Create Access Key**6. Download and save your **Access Key ID** and **Secret Access Key** securely



See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.5. Download and save your credentials securely



## Supported Regions⚠️ **Important**: Keep your secret access key confidential and never share it publicly.



Africa, Asia Pacific, China, Europe, Latin America, Middle East, North America (18 regions total)⚠️ **Security Note**: Never share your Secret Access Key publicly or commit it to version control!



## License## Usage



[MIT License](LICENSE) - Free for personal and commercial use## 📖 Usage



## Links### Running the Application



- [Documentation](docs/STRUCTURE.md)### First Launch

- [GitHub Setup Guide](docs/GITHUB-SETUP.md)

- [Huawei Cloud Docs](https://support.huaweicloud.com/en-us/)**Development mode:**



## Disclaimer1. Enter your **Access Key ID** and **Secret Access Key**```bash



This is an unofficial application and is not affiliated with Huawei Cloud.2. Click **Login** to authenticatenpm start



---3. Credentials are encrypted and stored locally for future sessions```



Made with ❤️ for Huawei Cloud users


### Managing Serversor



#### Server Selection```bash

Choose any ECS instance from the dropdown (shows all regions):npm run dev

``````

my-web-server (ap-southeast-1)

database-server (cn-north-4)### First Launch - Authentication

```

1. When you first launch the app, you'll see the authentication screen

#### Ignition Button States2. Enter your **Access Key ID**

- 🔴 **Red Glow** → Server stopped (click to start)3. Enter your **Secret Access Key**

- 🟢 **Green Glow** → Server running (click to stop)4. Click **Login**

- 🟡 **Yellow Pulse** → Operation in progress

The application will validate your credentials by attempting to connect to Huawei Cloud. If successful, your credentials are encrypted and stored locally. On subsequent launches, you'll bypass the login screen.

#### Auto-IP Feature

When enabled (toggle in UI):### Managing Servers

- ✅ Automatically creates temporary security group on start

- ✅ Grants your current IP address SSH/RDP access1. **Select a Server**: Choose an ECS instance from the dropdown menu

- ✅ Removes security group when server stops   - Servers are displayed with their name and region (e.g., "my-server (ap-southeast-1)")

- ✅ Persists across app restarts

2. **View Server Status**: The Ignition Button displays the current state:

### Keyboard Shortcuts   - 🔴 **Red Glow**: Server is stopped - click to start

   - 🟢 **Green Glow**: Server is running - click to stop

- **F12** - Toggle Developer Tools (debugging)   - 🟡 **Yellow Pulse**: Server is transitioning (starting/stopping)

- **ESC** - Close app (with security group cleanup prompt)

3. **Control Your Server**:

## 📁 Project Structure   - Click the Ignition Button to start a stopped server

   - Click the Ignition Button to stop a running server

```   - Wait for the operation to complete (status updates automatically)

ecs-switch/

├── src/4. **Monitor Quotas**:

│   ├── main/                    # Electron main process   - View your account quotas in the top section

│   │   ├── index.js             # Main entry point   - Click the refresh icon to manually update quota information

│   │   ├── preload.js           # Context bridge/IPC

│   │   └── services/            # Backend services5. **Logout**:

│   │       └── huawei-cloud.service.js  # Huawei Cloud API integration   - Click the **Logout** button in the header to clear stored credentials

│   ├── renderer/                # Electron renderer process (UI)

│   │   ├── views/               # HTML templates## Project Structure

│   │   │   ├── login.html       # Authentication view

│   │   │   └── main.html        # Server management view```

│   │   ├── scripts/             # Frontend JavaScripthuawei-cloud-ecs-manager/

│   │   │   ├── login.js         # Login logic├── main.js                 # Electron main process

│   │   │   └── main.js          # Main view logic├── preload.js             # Preload script for IPC bridge

│   │   └── styles/              # CSS stylesheets├── package.json           # Project dependencies

│   │       ├── login.css├── src/

│   │       └── main.css│   ├── huawei-api.js     # Huawei Cloud SDK integration

│   └── shared/                  # Shared utilities│   ├── views/

│       ├── constants.js         # App constants│   │   ├── login.html    # Authentication view

│       ├── state-manager.js     # State persistence│   │   └── main.html     # Server management view

│       └── ui-helpers.js        # UI utilities│   ├── styles/

├── docs/                        # Documentation│   │   ├── login.css     # Login view styles

├── build/                       # Build assets (icons)│   │   └── main.css      # Main view styles

├── .github/                     # GitHub configs│   └── scripts/

├── package.json│       ├── login.js      # Login view logic

└── README.md│       └── main.js       # Main view logic

```├── .github/

│   └── copilot-instructions.md

## 🛠️ Development└── README.md

```

### Scripts

## Technical Details

```bash

npm start          # Run in development mode### Technologies Used

npm run dev        # Run with dev flag

npm run build      # Build for all platforms- **Electron.js**: Cross-platform desktop application framework

npm run build:win  # Build for Windows- **Huawei Cloud SDK for Node.js**: Official SDK for ECS operations

npm run build:mac  # Build for macOS  - `@huaweicloud/huaweicloud-sdk-core`

npm run build:linux # Build for Linux  - `@huaweicloud/huaweicloud-sdk-ecs`

```  - `@huaweicloud/huaweicloud-sdk-iam`

- **electron-store**: Encrypted local storage for credentials

### Tech Stack

### Security

- **Frontend**: HTML5, CSS3, Vanilla JavaScript

- **Backend**: Electron.js (Node.js)- Credentials are encrypted using AES encryption before storage

- **Cloud SDK**: - No credentials are transmitted except to official Huawei Cloud APIs

  - `@huaweicloud/huaweicloud-sdk-core`- Context isolation enabled for renderer processes

  - `@huaweicloud/huaweicloud-sdk-ecs`- No remote code execution vulnerabilities

  - `@huaweicloud/huaweicloud-sdk-vpc`

  - `@huaweicloud/huaweicloud-sdk-iam`### Supported Operations

- **Storage**: `electron-store` (encrypted)

- **Build**: `electron-builder`, `electron-packager`The application uses the following Huawei Cloud ECS API operations:



### Supported Regions- **List Servers**: Retrieves all ECS instances across regions

- **Show Server**: Gets detailed information about a specific server

Africa, Asia Pacific, China, Europe, Latin America, North America, Middle East:- **Batch Start Servers**: Starts one or more servers

```- **Batch Stop Servers**: Gracefully stops one or more servers

af-north-1, af-south-1, ap-southeast-1, ap-southeast-2, - **Show Server Limits**: Retrieves account-level quota information

ap-southeast-3, ap-southeast-4, cn-east-3, cn-east-5, 

cn-north-4, cn-south-1, cn-southwest-2, sa-peru-1, ### Supported Regions

la-north-2, la-south-2, me-east-1, na-mexico-1, 

sa-brazil-1, tr-west-1The application checks for servers in the following regions:

```

- Africa: `af-south-1`

## 🔧 Troubleshooting- Asia Pacific: `ap-southeast-1`, `ap-southeast-2`, `ap-southeast-3`

- China: `cn-north-1`, `cn-north-4`, `cn-east-2`, `cn-east-3`, `cn-south-1`, `cn-southwest-2`

### Common Issues- Europe: `eu-west-0`, `eu-west-101`

- Latin America: `la-south-2`, `la-north-2`, `sa-brazil-1`

<details>- North America: `na-mexico-1`

<summary><b>❌ "Invalid credentials" error</b></summary>

## Troubleshooting

- Verify Access Key ID and Secret Access Key are correct

- Ensure your Huawei Cloud account has ECS permissions### "Invalid credentials" error

- Check that access keys haven't been revoked/expired- Verify your Access Key ID and Secret Access Key are correct

- Confirm your account is not suspended- Ensure your Huawei Cloud account has ECS permissions

</details>- Check that your access keys haven't expired



<details>### "No servers found"

<summary><b>❌ "No servers found"</b></summary>- Verify you have ECS instances created in your Huawei Cloud account

- Check that your account has permissions to view ECS resources

- Verify you have ECS instances in your Huawei Cloud account- Ensure servers exist in one of the supported regions

- Check account permissions for ECS resources

- Ensure servers exist in supported regions### "Failed to start/stop server" error

</details>- Check server status - it might already be in the requested state

- Verify you have permissions to manage the server

<details>- Check your account has sufficient resources/quota

<summary><b>❌ "Failed to start/stop server"</b></summary>- Review Huawei Cloud console for any billing or quota issues



- Server might already be in the requested state### Application won't start

- Verify permissions to manage the server- Ensure Node.js 16+ is installed: `node --version`

- Check account quotas/resources- Reinstall dependencies: `rm -rf node_modules && npm install`

- Review billing status in Huawei Cloud Console- Check for port conflicts if running multiple Electron apps

</details>

## Building for Production

<details>

<summary><b>❌ Application won't start</b></summary>To package the application for distribution:



```bash1. Install electron-builder:

# Check Node.js version   ```bash

node --version  # Should be v16+   npm install --save-dev electron-builder

   ```

# Reinstall dependencies

rm -rf node_modules package-lock.json2. Add build scripts to package.json:

npm install   ```json

   "scripts": {

# Run with debug output     "build": "electron-builder",

npm start     "build:win": "electron-builder --win",

```     "build:mac": "electron-builder --mac",

</details>     "build:linux": "electron-builder --linux"

   }

## 🤝 Contributing   ```



Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.3. Build:

   ```bash

### Development Workflow   npm run build

   ```

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)## Future Enhancements

3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)Potential features for future versions:

5. Open a Pull Request

- 🔄 Batch operations (start/stop multiple servers)

## 📝 License- 📈 Server metrics and monitoring graphs

- ⏰ Scheduled start/stop operations

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.- 🔔 Desktop notifications for status changes

- 🌐 Multi-account support

## 🙏 Acknowledgments- 📝 Server configuration editing

- 🔍 Advanced filtering and search

- Huawei Cloud for their comprehensive SDK- 💾 Export server lists and reports

- Electron.js community for excellent documentation

- Contributors and users of this project## License



## ⚠️ DisclaimerMIT License - feel free to use this project for personal or commercial purposes.



This is an **unofficial** application and is **not endorsed by or affiliated with Huawei Cloud**. Use at your own risk. Always verify critical operations in the official Huawei Cloud Console.## Support



## 📞 SupportFor issues related to:

- **This application**: Create an issue in the repository

- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/ecs-switch/issues)- **Huawei Cloud SDK**: Visit [Huawei Cloud Documentation](https://support.huaweicloud.com/en-us/)

- 💡 **Feature Requests**: [Open an issue](https://github.com/yourusername/ecs-switch/issues)- **Huawei Cloud Account**: Contact [Huawei Cloud Support](https://www.huaweicloud.com/en-us/support/)

- 📚 **Huawei Cloud Docs**: [Official Documentation](https://support.huaweicloud.com/en-us/)

- 🆘 **Huawei Cloud Support**: [Contact Support](https://www.huaweicloud.com/en-us/support/)## Disclaimer



## 🗺️ RoadmapThis is an unofficial application and is not endorsed by or affiliated with Huawei Cloud. Use at your own risk. Always verify critical operations in the Huawei Cloud Console.



- [ ] Batch operations (start/stop multiple servers)---

- [ ] Server metrics and monitoring graphs

- [ ] Scheduled start/stop operationsMade with ❤️ for Huawei Cloud users

- [ ] Desktop notifications for status changes
- [ ] Multi-account support
- [ ] Server configuration editing
- [ ] Advanced filtering and search capabilities
- [ ] Export server lists and reports
- [ ] CloudFormation/Terraform integration

---

<p align="center">
  Made with ❤️ for Huawei Cloud users
</p>

<p align="center">
  <a href="#-quick-start">Get Started</a> •
  <a href="#-usage">Documentation</a> •
  <a href="#-contributing">Contribute</a>
</p>
