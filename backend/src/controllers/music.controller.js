// src/controllers/music.controller.js

import {
  getAllMusics,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic
} from '../models/music.model.js';


export function listMusics(req, res) {
  res.json(getAllMusics());
}


export function getOneMusic(req, res) {
  const { musicId } = req.params;
  const music = getMusicById(musicId);

  if (!music) return res.status(404).json({ error: "Music not found" });

  res.json(music);
}

export function createOneMusic(req, res) {
  // On récupère name et duration depuis le body
  const created = createMusic(req.body);
  res.status(201).json(created);
}

export function updateOneMusic(req, res) {
  const { musicId } = req.params;
  const updated = updateMusic(musicId, req.body);

  if (!updated) return res.status(404).json({ error: "Music not found" });

  res.json(updated);
}

export function deleteOneMusic(req, res) {
  const { musicId } = req.params;
  const ok = deleteMusic(musicId);

  if (!ok) return res.status(404).json({ error: "Music not found" });

  res.status(204).send();
}