import { RedisClientType, createClient } from 'redis';

import dotenv from 'dotenv';

dotenv.config();

export class CacheService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: +(process.env.REDIS_PORT || '18978'),
      },
    });
    this.client.on('error', (err) =>
      console.error('[Redis Client Error]:', err)
    );
    this.client.connect().catch(console.error);
  }

  async get(key: string) {
    const result = await this.client.get(key);
    return result ? JSON.parse(result) : null;
  }

  async set(key: string, data: unknown, ttl: number = 60) {
    await this.client.set(key, JSON.stringify(data), { EX: ttl });
  }

  async invalidate(key: string) {
    return await this.client.del(key);
  }

  async invalidateAll() {
    await this.client.flushAll();
  }
}
