import { AppConfig, ConfigValidationResult } from "../schemas/config.schema";
export declare function migrateConfig(raw: any): any;
export declare class ConfigParser {
    private cache;
    private readonly CACHE_TTL;
    parse(raw: unknown, cacheKey?: string): ConfigValidationResult;
    invalidateCache(key?: string): void;
}
export interface DependencyGraph {
    nodes: Map<string, DependencyNode>;
    edges: Array<[string, string]>;
    order: string[];
}
interface DependencyNode {
    id: string;
    type: "ui" | "api" | "db" | "feature" | "auth";
    dependencies: string[];
    config: unknown;
}
export declare function buildDependencyGraph(config: AppConfig): DependencyGraph;
export declare function diffConfigs(prev: AppConfig, next: AppConfig): ConfigDiff;
export interface ConfigChange {
    type: "added" | "modified" | "removed";
    path: string;
    value?: unknown;
    prevValue?: unknown;
}
export interface ConfigDiff {
    changes: ConfigChange[];
    requiresMigration: boolean;
}
export {};
//# sourceMappingURL=config.engine.d.ts.map