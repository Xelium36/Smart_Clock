import { Router } from 'express';
import { listMusics } from '../../controllers/music.controller.js';

const router = Router();

router.get('/', listMusics);

export default router;