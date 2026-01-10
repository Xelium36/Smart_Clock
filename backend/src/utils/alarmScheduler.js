import schedule from "node-schedule";
import Alarm from "../models/alarm.model.js";
import { getIO } from "../socket.js";

const jobsByAlarmId = new Map();

export function scheduleAlarm(alarmDoc) {
  const alarmId = String(alarmDoc._id);

  // Annule ancienne planif si existe
  const existing = jobsByAlarmId.get(alarmId);
  if (existing) existing.cancel();

  if (!alarmDoc.enabled) return;
  if (!alarmDoc.scheduledWakeUpTime) return;

  const ringAt = new Date(alarmDoc.scheduledWakeUpTime);
  if (Number.isNaN(ringAt.getTime())) return;

  // If alarm has repeatDays configured, schedule a weekly recurrence
  if (alarmDoc.repeatDays && Array.isArray(alarmDoc.repeatDays) && alarmDoc.repeatDays.length > 0) {
    // Extract hour/minute/second from scheduledWakeUpTime
    const hour = ringAt.getHours();
    const minute = ringAt.getMinutes();
    const second = ringAt.getSeconds();

    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = alarmDoc.repeatDays;
    rule.hour = hour;
    rule.minute = minute;
    rule.second = second;

    const job = schedule.scheduleJob(rule, async () => {
      const io = getIO();

      console.log("Triggering recurring alarm", alarmId, "user", String(alarmDoc.userId), "time", new Date().toISOString());

      // 🔥 Recharge l'alarme avec la musique peuplée
      const alarm = await Alarm.findById(alarmId)
        .populate("musicId")
        .populate("dayTypeId");

      if (!alarm) return;

      // Compute next run time to include in payload if possible
      const nextRun = job.nextInvocation ? job.nextInvocation() : new Date();

      io.to(String(alarm.userId)).emit("alarm:triggered", {
        id: alarmId,
        label: alarm.label,
        scheduledWakeUpTime: nextRun ? nextRun.toISOString() : new Date().toISOString(),

        //  musique 
        music: alarm.musicId
          ? {
              name: alarm.musicId.name,
              filePath: alarm.musicId.filePath,
            }
          : null,

        // profil
        profile: alarm.dayTypeId
          ? {
              id: alarm.dayTypeId._id,
              name: alarm.dayTypeId.name,
            }
          : null,
      });
    });

    jobsByAlarmId.set(alarmId, job);
    console.log(
      "Scheduling recurring alarm",
      alarmId,
      "rule",
      JSON.stringify({ days: alarmDoc.repeatDays, hour, minute, second }),
      "user",
      String(alarmDoc.userId)
    );

    return;
  }

  // One-shot alarm
  if (ringAt.getTime() <= Date.now()) return;

  const job = schedule.scheduleJob(ringAt, async () => {
    const io = getIO();

    console.log("Triggering one-shot alarm", alarmId, "user", String(alarmDoc.userId), "time", new Date().toISOString());

    // 🔥 Recharge l'alarme avec la musique peuplée
    const alarm = await Alarm.findById(alarmId)
      .populate("musicId")
      .populate("dayTypeId");

    if (!alarm) return;

    io.to(String(alarm.userId)).emit("alarm:triggered", {
      id: alarmId,
      label: alarm.label,
      scheduledWakeUpTime: ringAt.toISOString(),

      //  musique 
      music: alarm.musicId
        ? {
            name: alarm.musicId.name,
            filePath: alarm.musicId.filePath,
          }
        : null,

      // profil
      profile: alarm.dayTypeId
        ? {
            id: alarm.dayTypeId._id,
            name: alarm.dayTypeId.name,
          }
        : null,
    });
  });

  jobsByAlarmId.set(alarmId, job);
  console.log(
    "Scheduling alarm",
    alarmId,
    "for",
    ringAt.toISOString(),
    "user",
    String(alarmDoc.userId)
  );
}

export function cancelAlarm(alarmId) {
  const id = String(alarmId);
  const job = jobsByAlarmId.get(id);
  if (job) job.cancel();
  jobsByAlarmId.delete(id);
}

export async function initAlarmScheduling() {
  for (const job of jobsByAlarmId.values()) job.cancel();
  jobsByAlarmId.clear();

  const now = new Date();

  const alarms = await Alarm.find({
    enabled: true,
    $or: [
      { repeatDays: { $exists: true, $ne: [] } },
      { scheduledWakeUpTime: { $gte: now } },
    ],
  });

  alarms.forEach(scheduleAlarm);
}
