import mongoose from "mongoose";

const alarmSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
    },
    time_start_interv: {
      type: String, 
      required: true,
    },
    duration_interv: {
      type: String, 
      required: true,
    },
    vibration: {
      type: Boolean,
      default: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    snooze:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Alarm = mongoose.model("Alarm", alarmSchema);

export function getAllAlarmsByUser(userId) {
  return alarms.filter(a => a.userId === userId);
}

export function getAlarm(userId, alarmId) {
  return alarms.find(a => a.userId === userId && a.id === alarmId);
}

export function createAlarm(data) {
  const newAlarm = { id: Date.now().toString(), ...data };
  alarms.push(newAlarm);
  return newAlarm;
}

export function updateAlarm(userId, alarmId, updates) {
  const idx = alarms.findIndex(a => a.userId === userId && a.id === alarmId);
  if (idx === -1) return null;
  alarms[idx] = { ...alarms[idx], ...updates };
  return alarms[idx];
}

export function deleteAlarm(userId, alarmId) {
  const before = alarms.length;
  alarms = alarms.filter(a => !(a.userId === userId && a.id === alarmId));
  return alarms.length < before;
}