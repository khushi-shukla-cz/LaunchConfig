export type LogCategory = "config" | "validation" | "runtime" | "auth" | "api" | "db" | "feature" | "security";
export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: unknown;
  traceId?: string;
}

class StructuredLogger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private level: LogLevel = process.env.LOG_LEVEL as LogLevel || "info";

  private readonly LEVELS: Record<LogLevel, number> = {
    debug: 0, info: 1, warn: 2, error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.LEVELS[level] >= this.LEVELS[this.level];
  }

  private write(level: LogLevel, category: LogCategory, message: string, data?: unknown, traceId?: string) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      category,
      message,
      data,
      traceId,
    };

    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    const color = { debug: "\x1b[37m", info: "\x1b[36m", warn: "\x1b[33m", error: "\x1b[31m" }[level];
    const reset = "\x1b[0m";
    const prefix = `${color}[${level.toUpperCase()}][${category}]${reset}`;

    if (level === "error") {
      console.error(`${prefix} ${message}`, data !== undefined ? data : "");
    } else if (level === "warn") {
      console.warn(`${prefix} ${message}`, data !== undefined ? data : "");
    } else {
      console.log(`${prefix} ${message}`, data !== undefined ? data : "");
    }
  }

  debug(category: LogCategory, message: string, data?: unknown) {
    this.write("debug", category, message, data);
  }
  info(category: LogCategory, message: string, data?: unknown) {
    this.write("info", category, message, data);
  }
  warn(category: LogCategory, message: string, data?: unknown) {
    this.write("warn", category, message, data);
  }
  error(category: LogCategory, message: string, data?: unknown) {
    this.write("error", category, message, data);
  }

  getLogs(filter?: { level?: LogLevel; category?: LogCategory; limit?: number }): LogEntry[] {
    let result = [...this.logs];
    if (filter?.level) {
      result = result.filter((l) => l.level === filter.level);
    }
    if (filter?.category) {
      result = result.filter((l) => l.category === filter.category);
    }
    if (filter?.limit) {
      result = result.slice(-filter.limit);
    }
    return result;
  }

  clear() {
    this.logs = [];
  }
}

export const logger = new StructuredLogger();
