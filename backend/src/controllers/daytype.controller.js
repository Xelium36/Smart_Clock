import DayType from "../models/daytype.model.js";

export async function listDayTypes(req, res) {
  const list = await DayType.find();
  res.json(list);
}

export async function getOneDayType(req, res) {
  const item = await DayType.findById(req.params.dayTypeId);
  if (!item) return res.status(404).json({ error: "DayType not found" });
  res.json(item);
}

export async function createOneDayType(req, res) {
  const created = await DayType.create(req.body);
  res.status(201).json(created);
}

export async function updateOneDayType(req, res) {
  const updated = await DayType.findByIdAndUpdate(
    req.params.dayTypeId,
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "DayType not found" });
  res.json(updated);
}

export async function deleteOneDayType(req, res) {
  const deleted = await DayType.findByIdAndDelete(req.params.dayTypeId);
  if (!deleted) return res.status(404).json({ error: "DayType not found" });
  res.status(204).send();
}
