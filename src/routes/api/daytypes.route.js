
import { Router } from 'express';
import {
  listDayTypes,
  getOneDayType,
  createOneDayType,
  updateOneDayType,
  deleteOneDayType
} from '../../controllers/daytype.controller.js';

const router = Router();

router.post('/', createOneDayType);

router.get('/', listDayTypes);

router.get('/:dayTypeId', getOneDayType);

router.patch('/:dayTypeId', updateOneDayType);

router.delete('/:dayTypeId', deleteOneDayType);

export default router;
