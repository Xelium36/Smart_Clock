import {
  getAllAlarmsByUser,
  getAlarm,
  createAlarm,
  updateAlarm,
  deleteAlarm
} from '../models/alarm.model.js';

export function listAlarms(req, res) {
  const { userId } = req.params;
  res.json(getAllAlarmsByUser(userId));
}

export function getOneAlarm(req, res) {
  const { userId, alarmId } = req.params;
  const alarm = getAlarm(userId, alarmId);

  if (!alarm) return res.status(404).json({ error: "Alarm not found" });

  res.json(alarm);
}

export function createOneAlarm(req, res) {
  const { userId } = req.params;
  const data = { userId, ...req.body };
  const created = createAlarm(data);
  res.status(201).json(created);
}

export function updateOneAlarm(req, res) {
  const { userId, alarmId } = req.params;
  const updated = updateAlarm(userId, alarmId, req.body);

  if (!updated) return res.status(404).json({ error: "Alarm not found" });

  res.json(updated);
}

export function deleteOneAlarm(req, res) {
  const { userId, alarmId } = req.params;
  const ok = deleteAlarm(userId, alarmId);

  if (!ok) return res.status(404).json({ error: "Alarm not found" });

  res.status(204).send();
}