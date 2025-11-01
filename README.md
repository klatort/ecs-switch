# Huawei Cloud ECS Manager

Desktop app to start/stop your Huawei Cloud servers.

## Install

```bash
git clone https://github.com/klatort/ecs-switch.git
cd ecs-switch
npm install
npm start
```

## Setup

1. Get your Access Key ID and Secret Key from [Huawei Cloud Console](https://console.huaweicloud.com) → My Credentials → Access Keys
2. Enter them in the app login screen
3. Done

## Usage

- Select a server from the dropdown
- Click the button to start/stop it
- Toggle "Auto-IP" to automatically allow your IP address through firewall

## Build

```bash
npm run build        # All platforms
npm run build:win    # Windows only
npm run build:mac    # macOS only
npm run build:linux  # Linux only
```

Output goes to `dist/` folder.

## License

MIT
