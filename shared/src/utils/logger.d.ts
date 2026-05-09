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
declare class StructuredLogger {
    private logs;
    private readonly MAX_LOGS;
    private level;
    private readonly LEVELS;
    private shouldLog;
    private write;
    debug(category: LogCategory, message: string, data?: unknown): void;
    info(category: LogCategory, message: string, data?: unknown): void;
    warn(category: LogCategory, message: string, data?: unknown): void;
    error(category: LogCategory, message: string, data?: unknown): void;
    getLogs(filter?: {
        level?: LogLevel;
        category?: LogCategory;
        limit?: number;
    }): LogEntry[];
    clear(): void;
}
export declare const logger: StructuredLogger;
export {};
//# sourceMappingURL=logger.d.ts.map