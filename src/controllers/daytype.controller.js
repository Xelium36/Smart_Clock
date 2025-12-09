
import {
  getAllDayTypes,
  getDayType,
  createDayType,
  updateDayType,
  deleteDayType
} from '../models/daytype.model.js';

export function listDayTypes(req, res) {
  res.json(getAllDayTypes());
}

export function getOneDayType(req, res) {
  const { dayTypeId } = req.params;
  const dt = getDayType(dayTypeId);

  if (!dt) {
    return res.status(404).json({ error: "DayType not found" });
  }

  res.json(dt);
}

export function createOneDayType(req, res) {
  const created = createDayType(req.body);
  res.status(201).json(created);
}

export function updateOneDayType(req, res) {
  const { dayTypeId } = req.params;
  const updated = updateDayType(dayTypeId, req.body);

  if (!updated) {
    return res.status(404).json({ error: "DayType not found" });
  }

  res.json(updated);
}

export function deleteOneDayType(req, res) {
  const { dayTypeId } = req.params;
  const ok = deleteDayType(dayTypeId);

  if (!ok) {
    return res.status(404).json({ error: "DayType not found" });
  }

  res.status(204).send();
}
