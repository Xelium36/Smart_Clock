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
  if (ringAt.getTime() <= Date.now()) return; // déjà passé

  const job = schedule.scheduleJob(ringAt, () => {
    const io = getIO();
    io.to(String(alarmDoc.userId)).emit("alarm:triggered", {
      id: alarmId,
      label: alarmDoc.label,
      scheduledWakeUpTime: ringAt.toISOString(),
      musicId: alarmDoc.musicId || null,
      dayTypeId: alarmDoc.dayTypeId || null,
    });
  });

  jobsByAlarmId.set(alarmId, job);
  console.log("Scheduling alarm", alarmId, "for", ringAt.toISOString(), "user", String(alarmDoc.userId));
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
    scheduledWakeUpTime: { $gte: now },
  });

  alarms.forEach(scheduleAlarm);
}
