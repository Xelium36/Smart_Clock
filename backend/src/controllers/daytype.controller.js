import DayType from '../models/daytype.model.js';

export async function listDayTypes(req, res, next) {
  try {
    // On charge le tableau 'musics' en entier
    const dayTypes = await DayType.find().populate('musics');
    res.json(dayTypes);
  } catch (e) {
    next(e);
  }
}

export async function updateDayType(req, res, next) {
  try {
    const { id } = req.params;
    // On met à jour, y compris le tableau de musics
    const updatedDayType = await DayType.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedDayType);
  } catch (e) {
    next(e);
  }
}