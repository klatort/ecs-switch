const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  getServers: () => ipcRenderer.invoke('get-servers'),
  getServerStatus: (params) => ipcRenderer.invoke('get-server-status', params),
  startServer: (params) => ipcRenderer.invoke('start-server', params),
  stopServer: (params) => ipcRenderer.invoke('stop-server', params),
  logout: () => ipcRenderer.invoke('logout'),
  getPublicIp: () => ipcRenderer.invoke('get-public-ip'),
  createTempSecurityGroup: (params) => ipcRenderer.invoke('create-temp-security-group', params),
  removeTempSecurityGroup: (params) => ipcRenderer.invoke('remove-temp-security-group', params)
});
