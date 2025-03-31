import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, data: unknown, ttl: number = 300) {
    return this.cache.set(key, data, ttl);
  }

  invalidate(key: string) {
    return this.cache.del(key);
  }

  invalidateAll() {
    return this.cache.flushAll();
  }
}