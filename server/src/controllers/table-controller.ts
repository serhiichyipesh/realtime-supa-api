import { NextFunction, Request, Response } from 'express';
import { cacheService, supabase } from '../app.js';

const TABLE_NAME = 'table';

export const getTableData = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cachedData = await cacheService.get(TABLE_NAME);

    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const data = await supabase.getData(TABLE_NAME);
    res.json(data);
    cacheService.set(TABLE_NAME, data);
  } catch (error) {
    next(error);
  }
};

export const addDataToTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newData = req.body;
    const result = await supabase.insertData(TABLE_NAME, { data: newData });

    cacheService.invalidate(TABLE_NAME);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteDataFromTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await supabase.deleteData(TABLE_NAME, id);

    cacheService.invalidate(TABLE_NAME);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
