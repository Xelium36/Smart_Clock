import { Router } from 'express';
import { listGenres, createGenre } from '../../controllers/genre.controller.js';

const router = Router();

router.get('/', listGenres);
router.post('/', createGenre);

export default router;