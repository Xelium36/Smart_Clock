import { Router } from 'express';
import { listDayTypes, updateDayType } from '../../controllers/daytype.controller.js';

const router = Router();

router.get('/', listDayTypes);
// NOUVEAU : Route pour modifier
router.put('/:id', updateDayType);

export default router;