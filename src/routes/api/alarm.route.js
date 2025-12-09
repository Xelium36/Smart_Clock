import { Router } from 'express';
import {
  listAlarms,
  getOneAlarm,
  createOneAlarm,
  updateOneAlarm,
  deleteOneAlarm
} from '../../controllers/alarm.controller.js';

const router = Router({ mergeParams: true });

// GET /users/:userId/alarms
router.get('/', listAlarms);

// GET /users/:userId/alarms/:alarmId
router.get('/:alarmId', getOneAlarm);

// POST /users/:userId/alarms
router.post('/', createOneAlarm);

// PATCH /users/:userId/alarms/:alarmId
router.patch('/:alarmId', updateOneAlarm);

// DELETE /users/:userId/alarms/:alarmId
router.delete('/:alarmId', deleteOneAlarm);

export default router;