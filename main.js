const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { 
  validateCredentials, 
  listAllServers, 
  getServerStatus, 
  startServer, 
  stopServer,
  getPublicIp,
  createTempSecurityGroup,
  removeTempSecurityGroup
} = require('./src/huawei-api');

const store = new Store({
  encryptionKey: 'huawei-ecs-manager-secure-key-2025'
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 460,
    minWidth: 380,
    minHeight: 420,
    resizable: false,
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
      .then(isValid => {
        if (isValid) {
          mainWindow.loadFile('src/views/main.html');
        } else {
          // Invalid stored credentials, clear and show login
          store.delete('credentials');
          mainWindow.loadFile('src/views/login.html');
        }
      })
      .catch(() => {
        store.delete('credentials');
        mainWindow.loadFile('src/views/login.html');
      });
  } else {
    mainWindow.loadFile('src/views/login.html');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Enable F12 to toggle DevTools for debugging
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
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
ipcMain.handle('login', async (event, { accessKeyId, secretAccessKey }) => {
  try {
    const isValid = await validateCredentials(accessKeyId, secretAccessKey);
    
    if (isValid) {
      store.set('credentials', {
        ak: accessKeyId,
        sk: secretAccessKey
      });
      
      // Navigate to main view
      mainWindow.loadFile(path.join(__dirname, 'src', 'views', 'main.html'));
      
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials. Please check and try again.' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Authentication failed. Please verify your keys.' };
  }
});

ipcMain.handle('get-servers', async () => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const servers = await listAllServers(credentials.ak, credentials.sk);
    return { success: true, servers };
  } catch (error) {
    console.error('Get servers error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-server-status', async (event, { serverId, region }) => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const status = await getServerStatus(credentials.ak, credentials.sk, serverId, region);
    return { success: true, status };
  } catch (error) {
    console.error('Get server status error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-server', async (event, { serverId, region }) => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    await startServer(credentials.ak, credentials.sk, serverId, region);
    return { success: true };
  } catch (error) {
    console.error('Start server error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-server', async (event, { serverId, region }) => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    await stopServer(credentials.ak, credentials.sk, serverId, region);
    return { success: true };
  } catch (error) {
    console.error('Stop server error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-public-ip', async () => {
  try {
    const ip = await getPublicIp();
    return { success: true, ip };
  } catch (error) {
    console.error('Get public IP error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-temp-security-group', async (event, { serverId, region, userIp }) => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    const result = await createTempSecurityGroup(credentials.ak, credentials.sk, serverId, region, userIp);
    return { success: true, sgId: result.sgId, sgName: result.sgName };
  } catch (error) {
    console.error('Create temp security group error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('remove-temp-security-group', async (event, { serverId, region, sgId, sgName }) => {
  try {
    const credentials = store.get('credentials');
    if (!credentials) {
      throw new Error('No credentials found');
    }
    
    await removeTempSecurityGroup(credentials.ak, credentials.sk, serverId, region, sgId, sgName);
    return { success: true };
  } catch (error) {
    console.error('Remove temp security group error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('logout', async () => {
  store.delete('credentials');
  mainWindow.loadFile('src/views/login.html');
  return { success: true };
});
