import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import logger from './services/logger.service';
import config from '../shared/config';
import { 
  validateCredentials, 
  listAllServers, 
  getServerStatus, 
  startServer, 
  stopServer,
  getPublicIp,
  createTempSecurityGroup,
  removeTempSecurityGroup
} from './services/huawei-cloud.service';

// Type definitions
interface Credentials {
  ak: string;
  sk: string;
}

interface LoginParams {
  accessKeyId: string;
  secretAccessKey: string;
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
    show: false
  });

  // Remove menu bar completely
  mainWindow.setMenu(null);

  // Check if credentials exist
  const credentials = store.get('credentials');
  
  if (credentials && credentials.ak && credentials.sk) {
    // Validate credentials and load main view
    validateCredentials(credentials.ak, credentials.sk)
      .then((isValid: boolean) => {
        if (isValid && mainWindow) {
          mainWindow.loadFile('src/renderer/views/main.html');
        } else {
          // Invalid stored credentials, clear and show login
          store.delete('credentials');
          if (mainWindow) {
            mainWindow.loadFile('src/renderer/views/login.html');
          }
        }
      })
      .catch(() => {
        store.delete('credentials');
        if (mainWindow) {
          mainWindow.loadFile('src/renderer/views/login.html');
        }
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

// IPC Handlers
ipcMain.handle('login', async (_event: IpcMainInvokeEvent, { accessKeyId, secretAccessKey }: LoginParams) => {
  try {
    logger.info('Login attempt...');
    const isValid = await validateCredentials(accessKeyId, secretAccessKey);
    
    if (isValid) {
      logger.info('Login successful');
      store.set('credentials', {
        ak: accessKeyId,
        sk: secretAccessKey
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
    
    const servers = await listAllServers(credentials.ak, credentials.sk);
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
    
    const status = await getServerStatus(credentials.ak, credentials.sk, serverId, region);
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
    
    await startServer(credentials.ak, credentials.sk, serverId, region);
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
    
    await stopServer(credentials.ak, credentials.sk, serverId, region);
    return { success: true };
  } catch (error: any) {
    console.error('Stop server error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-public-ip', async (): Promise<ApiResponse> => {
  try {
    const ip = await getPublicIp();
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
    
    const result = await createTempSecurityGroup(credentials.ak, credentials.sk, serverId, region, userIp);
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
    
    await removeTempSecurityGroup(credentials.ak, credentials.sk, serverId, region, sgId, sgName);
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
