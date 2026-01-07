import Alarm from '../models/alarm.model.js';

export async function createOneAlarm(req, res, next) {
    try {
        const alarm = await Alarm.create(req.body);
        res.status(201).json(alarm);
    } catch (e) {
        next(e);
    }
}

export async function listAlarmsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const alarms = await Alarm.find({ userId })
      .populate('musicId')
      .populate('dayTypeId')
      .sort({ scheduledWakeUpTime: 1 });
      
    res.json(alarms);
  } catch (e) {
    next(e);
  }
}