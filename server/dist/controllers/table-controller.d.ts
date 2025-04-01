import { NextFunction, Request, Response } from 'express';
export declare const getTableData: (_: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addDataToTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDataFromTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
