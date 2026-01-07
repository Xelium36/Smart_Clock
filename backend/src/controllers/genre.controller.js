import Genre from '../models/genre.model.js';

export async function listGenres(req, res, next) {
  try {
    const genres = await Genre.find().populate('musics');
    res.json(genres);
  } catch (e) { next(e); }
}

export async function createGenre(req, res, next) {
  try {
    const genre = await Genre.create(req.body);
    res.status(201).json(genre);
  } catch (e) { next(e); }
}