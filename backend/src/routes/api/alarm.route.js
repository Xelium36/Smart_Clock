import { Router } from "express";
import { createOneAlarm, listAlarmsByUser, snoozeAlarm } from "../../controllers/alarm.controller.js";

const router = Router();

router.post("/", createOneAlarm);
router.post("/:id/snooze", snoozeAlarm);

router.get("/user/:userId", listAlarmsByUser);

export default router;
