import express from 'express';
import { register, login } from '../controllers/auth.Controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/authRole';
import upload from '../middlewares/upload';

const authRoutes = express.Router();

authRoutes.post('/register',upload.single('avatar') , register);
authRoutes.post('/login', login);

export default authRoutes;