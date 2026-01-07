import { Router } from 'express';
import { createOneAlarm, listAlarmsByUser } from '../../controllers/alarm.controller.js';

const router = Router();

router.post('/', createOneAlarm);
router.get('/user/:userId', listAlarmsByUser);

export default router;