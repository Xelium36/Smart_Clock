import Music from '../models/music.model.js';

export async function listMusics(req, res, next) {
  try {
    const musics = await Music.find();
    res.json(musics);
  } catch (e) {
    next(e);
  }
}