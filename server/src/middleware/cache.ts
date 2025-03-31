import { NextFunction, Request, Response } from 'express';

import { CacheService } from '../services/cache-service.js';

const cacheService = new CacheService();

export const cacheMiddleware = (ttl?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.originalUrl}`;
    const cachedResponse = cacheService.get(key);

    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    const originalJson = res.json;
    res.json = function (data) {
      res.json = originalJson;
      cacheService.set(key, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};