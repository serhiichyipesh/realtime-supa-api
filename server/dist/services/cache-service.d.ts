export declare class CacheService {
    private client;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, data: unknown, ttl?: number): Promise<void>;
    invalidate(key: string): Promise<number>;
    invalidateAll(): Promise<void>;
}
