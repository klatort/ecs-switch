/**
 * Logging Service
 * Centralized logging with configurable levels and output
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export type LogLevelName = keyof typeof LogLevel;

class LoggerService {
  private level: LogLevel;
  private readonly prefix: string = '[ECS Manager]';

  constructor() {
    // Default to INFO level in production, DEBUG in development
    this.level = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
  }

  setLevel(level: LogLevelName): void {
    if (LogLevel[level] !== undefined) {
      this.level = LogLevel[level];
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(`${this.prefix} [ERROR]`, message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(`${this.prefix} [WARN]`, message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(`${this.prefix} [INFO]`, message, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.DEBUG) {
      console.log(`${this.prefix} [DEBUG]`, message, ...args);
    }
  }

  // Specialized API logging
  api(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.log(`${this.prefix} [API]`, message, ...args);
    }
  }

  // Specialized UI logging
  ui(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.DEBUG) {
      console.log(`${this.prefix} [UI]`, message, ...args);
    }
  }
}

// Export singleton instance
export default new LoggerService();
