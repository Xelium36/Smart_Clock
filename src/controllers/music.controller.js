// src/controllers/music.controller.js

import {
  getAllMusics,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
} from "../models/music.model.js";

/**
 * GET /api/v1/musics
 */
export async function listMusics(_req, res, next) {
  try {
    const musics = await getAllMusics();
    res.json(musics);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/musics/:musicId
 */
export async function getOneMusic(req, res, next) {
  try {
    const { musicId } = req.params;
    const music = await getMusicById(musicId);

    if (!music) return res.status(404).json({ error: "Music not found" });

    res.json(music);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/musics
 * multipart/form-data:
 *  - name: string
 *  - file: mp3
 */
export async function createOneMusic(req, res, next) {
  try {
    // fichier?
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "mp3 file is required (field: file)" });
    }

    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "name is required" });
    }

    // URL publique si y'a (app.use("/uploads", express.static("uploads")))
    const fileUrl = `/uploads/${req.file.filename}`;

    const created = await createMusic({
      name: name.trim(),
      fileUrl,
      mime: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/musics/:musicId
 * body: { name?: string, fileUrl?: string }
 */
export async function updateOneMusic(req, res, next) {
  try {
    const { musicId } = req.params;

    // Sécurité
    const { _id, createdAt, size, mime, ...safeUpdates } = req.body;

    const updated = await updateMusic(musicId, safeUpdates);

    if (!updated) return res.status(404).json({ error: "Music not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/musics/:musicId
 */
export async function deleteOneMusic(req, res, next) {
  try {
    const { musicId } = req.params;

    const ok = await deleteMusic(musicId);

    if (!ok) return res.status(404).json({ error: "Music not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
