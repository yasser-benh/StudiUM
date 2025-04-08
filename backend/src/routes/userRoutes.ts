import express from 'express';

import {  deleteUser, getAllUsers, getProfile, getUserById, presidents, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/authRole';

const userRoutes = express.Router();
userRoutes.get('/', getAllUsers);
userRoutes.get('/presidents',  presidents);
userRoutes.get('/:id', getUserById);
userRoutes.get('/profile', authMiddleware, getProfile);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;