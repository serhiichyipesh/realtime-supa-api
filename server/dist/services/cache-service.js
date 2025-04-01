import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
export class CacheService {
    client;
    constructor() {
        this.client = createClient({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: +(process.env.REDIS_PORT || '18978'),
            },
        });
        this.client.on('error', (err) => console.error('[Redis Client Error]:', err));
        this.client.connect().catch(console.error);
    }
    async get(key) {
        const result = await this.client.get(key);
        return result ? JSON.parse(result) : null;
    }
    async set(key, data, ttl = 60) {
        await this.client.set(key, JSON.stringify(data), { EX: ttl });
    }
    async invalidate(key) {
        return await this.client.del(key);
    }
    async invalidateAll() {
        await this.client.flushAll();
    }
}
//# sourceMappingURL=cache-service.js.map