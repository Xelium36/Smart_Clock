import Alarm from "../models/alarm.model.js";
import { nextDateAtTimeHHmm } from "../utils/time.js";
import { scheduleAlarm } from "../utils/alarmScheduler.js";

export async function createOneAlarm(req, res, next) {
  try {
    const body = { ...req.body };
    Object.keys(body).forEach((k) => {
      if (body[k] === "" || body[k] == null) delete body[k];
    });

    // Si front ne fournit pas scheduledWakeUpTime, on le calcule ici
    if (!body.scheduledWakeUpTime) {
      body.scheduledWakeUpTime = nextDateAtTimeHHmm(body.targetWakeUpTime);
    }

    const alarm = await Alarm.create(body);
    console.log("✅ Created alarm:", {
  id: alarm._id.toString(),
  userId: alarm.userId.toString(),
  scheduledWakeUpTime: alarm.scheduledWakeUpTime,
  enabled: alarm.enabled
});



    scheduleAlarm(alarm);

    res.status(201).json(alarm);
  } catch (e) {
    next(e);
  }
}



export async function listAlarmsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const alarms = await Alarm.find({ userId })
      .populate("musicId")
      .populate("dayTypeId")
      .sort({ scheduledWakeUpTime: 1 });

    res.json(alarms);
  } catch (e) {
    next(e);
  }
}

export async function snoozeAlarm(req, res, next) {
  try {
    console.log("😴 SNOOZE called for id:", req.params.id);

    const { id } = req.params;
    const alarm = await Alarm.findById(id);
    if (!alarm) return res.status(404).json({ message: "Alarm not found" });

    const snoozeMinutes = 10;
    alarm.scheduledWakeUpTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);
    alarm.snooze = true;
    alarm.enabled = true;

    await alarm.save();

    console.log("✅ Snoozed to:", alarm.scheduledWakeUpTime.toISOString());
    scheduleAlarm(alarm);

    res.json(alarm);
  } catch (e) {
    next(e);
  }
}
