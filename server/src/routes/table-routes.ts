import {
  addDataToTable,
  deleteDataFromTable,
  getTableData,
} from '../controllers/table-controller.js';

import { Router } from 'express';

const router: Router = Router();

router.get('/', getTableData);
router.post('/', addDataToTable);
router.delete('/:id', deleteDataFromTable);

export default router;
