import { Router } from "express";
import { createOneAlarm, listAlarmsByUser, snoozeAlarm, deleteAlarm } from "../../controllers/alarm.controller.js";


const router = Router();

router.post("/", createOneAlarm);
router.post("/:id/snooze", snoozeAlarm)
router.get("/user/:userId", listAlarmsByUser);

router.delete("/:id", deleteAlarm);

export default router;
