// src/routes/api/music.route.js

import { Router } from 'express';
import {
  listMusics,
  getOneMusic,
  createOneMusic,
  updateOneMusic,
  deleteOneMusic
} from '../../controllers/music.controller.js';

const router = Router();

/**
 * GET /api/v1/musics
 *  */ 
router.get('/', listMusics);

// GET /api/v1/musics/:musicId
router.get('/:musicId', getOneMusic);

// POST /api/v1/musics
router.post('/', createOneMusic);

// PATCH /api/v1/musics/:musicId
router.patch('/:musicId', updateOneMusic);

// DELETE /api/v1/musics/:musicId
router.delete('/:musicId', deleteOneMusic);

export default router;