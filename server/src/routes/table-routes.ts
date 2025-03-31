import { addDataToTable, deleteDataFromTable, getTableData } from '../controllers/table-controller.js';

import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache.js';

const router: Router = Router();

router.get('/', cacheMiddleware(300), getTableData);
router.post('/', addDataToTable);
router.delete('/:id', deleteDataFromTable);

export default router;