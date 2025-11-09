import { contextBridge, ipcRenderer } from 'electron';

// Type definitions for IPC parameters
interface LoginCredentials {
  ak: string;
  sk: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface ServerParams {
  serverId: string;
  region: string;
}

interface ServersResult {
  success: boolean;
  servers?: any[];
  error?: string;
}

interface ServerStatusResult {
  success: boolean;
  status?: string;
  error?: string;
}

interface SecurityGroupParams {
  serverId: string;
  region: string;
  userIp?: string;
  sgId?: string;
  sgName?: string;
}

interface SecurityGroupResult {
  success: boolean;
  sgId?: string;
  sgName?: string;
  error?: string;
}

interface PublicIpResult {
  success: boolean;
  ip?: string;
  error?: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  [key: string]: any;
}

// Define the API interface
interface ElectronAPI {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  getServers: () => Promise<ServersResult>;
  getServerStatus: (params: ServerParams) => Promise<ServerStatusResult>;
  startServer: (params: ServerParams) => Promise<ApiResponse>;
  stopServer: (params: ServerParams) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  getPublicIp: () => Promise<PublicIpResult>;
  createTempSecurityGroup: (params: SecurityGroupParams) => Promise<SecurityGroupResult>;
  removeTempSecurityGroup: (params: SecurityGroupParams) => Promise<ApiResponse>;
  closeWindow: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
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
  removeTempSecurityGroup: (params: SecurityGroupParams) => ipcRenderer.invoke('remove-temp-security-group', params),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize')
} as ElectronAPI);

// Extend Window interface for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
