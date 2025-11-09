/**
 * Application Configuration
 * Environment-specific settings and constants
 */

module.exports = {
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

  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development'
};
