import { NextFunction, Request, Response } from 'express';

import { CacheService } from '../services/cache-service.js';
import { SupabaseService } from '../services/supabase-service.js';

const supabase = new SupabaseService();
const cacheService = new CacheService();
const TABLE_NAME = "table";

export const getTableData = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await supabase.getData(TABLE_NAME);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addDataToTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newData = req.body;
    const result = await supabase.insertData(TABLE_NAME, newData);

    cacheService.invalidate(TABLE_NAME);

      res.status(201).json(result);
    } catch (error) {
      next(error);
  }
};

export const deleteDataFromTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await supabase.deleteData(TABLE_NAME, id);

    cacheService.invalidate(TABLE_NAME);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};