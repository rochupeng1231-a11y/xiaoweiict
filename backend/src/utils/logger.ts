// 简单的日志工具

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const formatTimestamp = (): string => {
  return new Date().toISOString();
};

const log = (level: LogLevel, message: string, data?: unknown): void => {
  const entry: LogEntry = {
    timestamp: formatTimestamp(),
    level,
    message,
    data,
  };

  const logString = `[${entry.timestamp}] [${entry.level}] ${entry.message}${
    data ? ` ${JSON.stringify(data)}` : ''
  }`;

  switch (level) {
    case LogLevel.INFO:
      console.info(logString);
      break;
    case LogLevel.WARN:
      console.warn(logString);
      break;
    case LogLevel.ERROR:
      console.error(logString);
      break;
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log(LogLevel.INFO, message, data),
  warn: (message: string, data?: unknown) => log(LogLevel.WARN, message, data),
  error: (message: string, data?: unknown) => log(LogLevel.ERROR, message, data),
};

export default logger;
