import { Router } from 'express';
import {
  listUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser
} from '../../controllers/user.controller.js';

const router = Router();

// GET /api/users
router.get('/', listUsers);

// GET /api/users/:userId
router.get('/:userId', getOneUser);

// POST /api/users
router.post('/', createOneUser);

// PATCH /api/users/:userId
router.patch('/:userId', updateOneUser);

// DELETE /api/users/:userId
router.delete('/:userId', deleteOneUser);

export default router;