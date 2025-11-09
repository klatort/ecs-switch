/**
 * Logging Service
 * Centralized logging with configurable levels and output
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class LoggerService {
  constructor() {
    // Default to INFO level in production, DEBUG in development
    this.level = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
    this.prefix = '[ECS Manager]';
  }

  setLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      this.level = LOG_LEVELS[level];
    }
  }

  error(message, ...args) {
    if (this.level >= LOG_LEVELS.ERROR) {
      console.error(`${this.prefix} [ERROR]`, message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.level >= LOG_LEVELS.WARN) {
      console.warn(`${this.prefix} [WARN]`, message, ...args);
    }
  }

  info(message, ...args) {
    if (this.level >= LOG_LEVELS.INFO) {
      console.log(`${this.prefix} [INFO]`, message, ...args);
    }
  }

  debug(message, ...args) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      console.log(`${this.prefix} [DEBUG]`, message, ...args);
    }
  }

  // Specialized API logging
  api(message, ...args) {
    if (this.level >= LOG_LEVELS.INFO) {
      console.log(`${this.prefix} [API]`, message, ...args);
    }
  }

  // Specialized UI logging
  ui(message, ...args) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      console.log(`${this.prefix} [UI]`, message, ...args);
    }
  }
}

// Export singleton instance
module.exports = new LoggerService();
