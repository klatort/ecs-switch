// Enable V8 compile cache for faster startup
require('v8-compile-cache');

import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import logger from './services/logger.service';
import config from '../shared/config';

// Lazy load Huawei Cloud SDK (only when needed)
let huaweiCloudService: any = null;
function getHuaweiService() {
  if (!huaweiCloudService) {
    huaweiCloudService = require('./services/huawei-cloud.service');
  }
  return huaweiCloudService;
}

// Type definitions
interface Credentials {
  ak: string;
  sk: string;
}

interface ServerParams {
  serverId: string;
  region: string;
}

interface SecurityGroupParams extends ServerParams {
  userIp?: string;
  sgId?: string;
  sgName?: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  [key: string]: any;  // Allow additional properties
}

const store = new Store<{ credentials?: Credentials }>({
  encryptionKey: config.app.encryptionKey
});

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  logger.info('Creating application window...');
  
  mainWindow = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    resizable: config.window.resizable,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0a0a0a',
    show: false // Will be shown in ready-to-show event
  });

  // Remove menu bar completely
  mainWindow.setMenu(null);

  // Check if credentials exist
  const credentials = store.get('credentials');
  
  if (credentials && credentials.ak && credentials.sk) {
    // Load main view immediately - don't wait for validation
    mainWindow.loadFile('src/renderer/views/main.html');
    
    // Validate credentials in background (async, non-blocking)
    const service = getHuaweiService();
    service.validateCredentials(credentials.ak, credentials.sk)
      .then((isValid: boolean) => {
        if (!isValid && mainWindow) {
          // Invalid credentials - redirect to login
          logger.warn('Stored credentials are invalid, redirecting to login');
          store.delete('credentials');
          mainWindow.loadFile('src/renderer/views/login.html');
        }
      })
      .catch((error) => {
        logger.error('Credential validation failed:', error);
        // Keep using stored credentials even if validation fails (might be network issue)
      });
  } else {
    mainWindow.loadFile('src/renderer/views/login.html');
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Enable F12 to toggle DevTools for debugging
  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown' && mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Window control handlers
ipcMain.handle('window:close', () => {
  logger.info('Window close requested');
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('window:minimize', () => {
  logger.info('Window minimize requested');
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window:maximize', () => {
  logger.info('Window maximize requested');
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

// IPC Handlers
ipcMain.handle('login', async (_event: IpcMainInvokeEvent, { ak, sk }: Credentials) => {
  try {
    logger.info('Login attempt...');
    const service = getHuaweiService();
    const isValid = await service.validateCredentials(ak, sk);
    
    if (isValid) {
      logger.info('Login successful');
      store.set('credentials', {
        ak,
        sk
      });
      
      // Navigate to main view
      if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'views', 'main.html'));
      }
      
      return { success: true };
    } else {
      logger.warn('Login failed: Invalid credentials');
      return { success: false, error: 'Invalid credentials. Please check and try again.' };
    }
  } catch (error: any) {
    logger.error('Login error:', error);
    return { success: false, error: 'Authentication failed. Please verify your keys.' };
  }
});

ipcMain.handle('get-servers', async (): Promise<ApiResponse> => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const service = getHuaweiService();
    const servers = await service.listAllServers(credentials.ak, credentials.sk);
    return { success: true, servers };
  } catch (error: any) {
    console.error('Get servers error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-server-status', async (_event: IpcMainInvokeEvent, { serverId, region }: ServerParams): Promise<ApiResponse> => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const service = getHuaweiService();
    const status = await service.getServerStatus(credentials.ak, credentials.sk, serverId, region);
    return { success: true, status };
  } catch (error: any) {
    console.error('Get server status error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-server', async (_event: IpcMainInvokeEvent, { serverId, region }: ServerParams): Promise<ApiResponse> => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const service = getHuaweiService();
    await service.startServer(credentials.ak, credentials.sk, serverId, region);
    return { success: true };
  } catch (error: any) {
    console.error('Start server error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-server', async (_event: IpcMainInvokeEvent, { serverId, region }: ServerParams): Promise<ApiResponse> => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const service = getHuaweiService();
    await service.stopServer(credentials.ak, credentials.sk, serverId, region);
    return { success: true };
  } catch (error: any) {
    console.error('Stop server error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-public-ip', async (): Promise<ApiResponse> => {
  try {
    const service = getHuaweiService();
    const ip = await service.getPublicIp();
    return { success: true, ip };
  } catch (error: any) {
    console.error('Get public IP error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-temp-security-group', async (_event: IpcMainInvokeEvent, { serverId, region, userIp }: SecurityGroupParams): Promise<ApiResponse> => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    if (!userIp) {
      throw new Error('User IP is required');
    }
    
    const service = getHuaweiService();
    const result = await service.createTempSecurityGroup(credentials.ak, credentials.sk, serverId, region, userIp);
    return { success: true, sgId: result.sgId, sgName: result.sgName };
  } catch (error: any) {
    console.error('Create temp security group error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('remove-temp-security-group', async (_event: IpcMainInvokeEvent, { serverId, region, sgId, sgName }: SecurityGroupParams): Promise<ApiResponse> => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    if (!sgId || !sgName) {
      throw new Error('Security group ID and name are required');
    }
    
    const service = getHuaweiService();
    await service.removeTempSecurityGroup(credentials.ak, credentials.sk, serverId, region, sgId, sgName);
    return { success: true };
  } catch (error: any) {
    console.error('Remove temp security group error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('logout', async (): Promise<ApiResponse> => {
  store.delete('credentials');
  if (mainWindow) {
    mainWindow.loadFile('src/renderer/views/login.html');
  }
  return { success: true };
});
