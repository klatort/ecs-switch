import { contextBridge, ipcRenderer } from 'electron';

// Type definitions for IPC parameters
interface LoginCredentials {
  ak: string;
  sk: string;
}

interface ServerParams {
  serverId: string;
  region: string;
}

interface SecurityGroupParams {
  serverId: string;
  region: string;
  userIp?: string;
  sgId?: string;
  sgName?: string;
}

// Define the API interface
interface ElectronAPI {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  getServers: () => Promise<any[]>;
  getServerStatus: (params: ServerParams) => Promise<string>;
  startServer: (params: ServerParams) => Promise<void>;
  stopServer: (params: ServerParams) => Promise<void>;
  logout: () => Promise<void>;
  getPublicIp: () => Promise<string>;
  createTempSecurityGroup: (params: SecurityGroupParams) => Promise<{ sgId: string; sgName: string }>;
  removeTempSecurityGroup: (params: SecurityGroupParams) => Promise<void>;
}

// Expose API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials: LoginCredentials) => ipcRenderer.invoke('login', credentials),
  getServers: () => ipcRenderer.invoke('get-servers'),
  getServerStatus: (params: ServerParams) => ipcRenderer.invoke('get-server-status', params),
  startServer: (params: ServerParams) => ipcRenderer.invoke('start-server', params),
  stopServer: (params: ServerParams) => ipcRenderer.invoke('stop-server', params),
  logout: () => ipcRenderer.invoke('logout'),
  getPublicIp: () => ipcRenderer.invoke('get-public-ip'),
  createTempSecurityGroup: (params: SecurityGroupParams) => ipcRenderer.invoke('create-temp-security-group', params),
  removeTempSecurityGroup: (params: SecurityGroupParams) => ipcRenderer.invoke('remove-temp-security-group', params)
} as ElectronAPI);

// Extend Window interface for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
