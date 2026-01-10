import Alarm from "../models/alarm.model.js";
import { nextDateAtTimeHHmm } from "../utils/time.js";
import { scheduleAlarm } from "../utils/alarmScheduler.js";
import DayType from "../models/daytype.model.js";
import Music from "../models/music.model.js";
import { cancelAlarm } from "../utils/alarmScheduler.js";




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

    // Musique
    if (!body.musicId && body.dayTypeId) {
      const dayType = await DayType.findById(body.dayTypeId).populate("musics");

      if (!dayType) {
        throw new Error("DayType (profil) not found");
      }

      if (!dayType.musics || dayType.musics.length === 0) {
        throw new Error("No musics in this profile playlist");
      }

      const randomMusic =
        dayType.musics[Math.floor(Math.random() * dayType.musics.length)];

      body.musicId = randomMusic._id;
    }

    // Repeat days -- normalize and validate
    if (Array.isArray(body.repeatDays)) {
      // Filter to integers 0-6 and unique
      const normalized = Array.from(
        new Set(
          body.repeatDays
            .map((d) => Number(d))
            .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)
        )
      );
      if (normalized.length === 0) {
        delete body.repeatDays;
      } else {
        body.repeatDays = normalized;
      }
    } else {
      // If empty string or null from front, ensure it's removed
      if (body.repeatDays == null || body.repeatDays === "") delete body.repeatDays;
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

export async function deleteAlarm(req, res, next) {
  try {
    const { id } = req.params;

    const alarm = await Alarm.findByIdAndDelete(id);
    if (!alarm) return res.status(404).json({ message: "Alarm not found" });

    cancelAlarm(id);

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
