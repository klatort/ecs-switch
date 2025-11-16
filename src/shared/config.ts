/**
 * Application Configuration
 * Environment-specific settings and constants
 */

export interface AppConfig {
  name: string;
  version: string;
  encryptionKey: string;
}

export interface WindowConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  resizable: boolean;
}

export interface TimeoutConfig {
  api: number;
  serverOperation: number;
  statusCheck: number;
}

export interface IntervalConfig {
  statusRefresh: number;
  quotaRefresh: number;
  factRotation: number;
}

export interface SecurityGroupConfig {
  namePrefix: string;
  description: string;
  disassociationWait: number;
}

export interface RegionConfig {
  // Only check these regions for faster startup. Set to null to check all regions.
  // Example: ['sa-peru-1', 'la-south-2'] to only check Lima and Santiago
  preferredRegions: string[] | null;
}

export interface Config {
  app: AppConfig;
  window: WindowConfig;
  timeouts: TimeoutConfig;
  intervals: IntervalConfig;
  operationStateExpiry: number;
  securityGroup: SecurityGroupConfig;
  regions: RegionConfig;
  isDevelopment: boolean;
}

const config: Config = {
  // Application metadata
  app: {
    name: 'Huawei Cloud ECS Manager',
    version: '1.0.2b',
    encryptionKey: 'huawei-ecs-manager-secure-key-2025'
  },

  // Window configuration
  window: {
    width: 420,
    height: 460,
    minWidth: 380,
    minHeight: 420,
    resizable: false
  },

  // API timeouts (milliseconds)
  timeouts: {
    api: 120000,           // 2 minutes for API calls
    serverOperation: 300000, // 5 minutes for start/stop operations
    statusCheck: 30000     // 30 seconds for status checks
  },

  // Refresh intervals (milliseconds)
  intervals: {
    statusRefresh: 30000,  // Auto-refresh server status every 30s
    quotaRefresh: 300000,  // Auto-refresh quotas every 5 minutes
    factRotation: 8000     // Change IT fact every 8 seconds
  },

  // Operation state expiry (milliseconds)
  operationStateExpiry: 300000, // 5 minutes

  // Security group settings
  securityGroup: {
    namePrefix: 'temp-access',
    description: 'Temporary access for remote connection',
    disassociationWait: 5000 // 5 seconds wait after disassociation
  },

  // Region settings for optimization
  regions: {
    // Only check these specific regions for faster startup
    // Set to null to check all 18 regions (slower but comprehensive)
    // Example: ['sa-peru-1', 'la-south-2'] for Lima and Santiago only
    preferredRegions: ['sa-peru-1', 'la-south-2'] // Only check Lima and Santiago
  },

  // Development mode flag
  isDevelopment: process.env.NODE_ENV === 'development'
};

export default config;
