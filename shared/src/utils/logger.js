"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class StructuredLogger {
    constructor() {
        this.logs = [];
        this.MAX_LOGS = 1000;
        this.level = process.env.LOG_LEVEL || "info";
        this.LEVELS = {
            debug: 0, info: 1, warn: 2, error: 3,
        };
    }
    shouldLog(level) {
        return this.LEVELS[level] >= this.LEVELS[this.level];
    }
    write(level, category, message, data, traceId) {
        if (!this.shouldLog(level))
            return;
        const entry = {
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
        }
        else if (level === "warn") {
            console.warn(`${prefix} ${message}`, data !== undefined ? data : "");
        }
        else {
            console.log(`${prefix} ${message}`, data !== undefined ? data : "");
        }
    }
    debug(category, message, data) {
        this.write("debug", category, message, data);
    }
    info(category, message, data) {
        this.write("info", category, message, data);
    }
    warn(category, message, data) {
        this.write("warn", category, message, data);
    }
    error(category, message, data) {
        this.write("error", category, message, data);
    }
    getLogs(filter) {
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
exports.logger = new StructuredLogger();
//# sourceMappingURL=logger.js.map