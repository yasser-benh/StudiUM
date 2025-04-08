import express from 'express';
import {  getAllClubs, joinClub, leaveClub ,deleteClub, updateClub, getClubById, createClub } from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/authRole';
import upload from '../middlewares/upload';

const clubRouts = express.Router();

clubRouts.post('/', upload.single("logo"),createClub);
clubRouts.get('/', getAllClubs);
clubRouts.get('/:id', getClubById);
clubRouts.put('/:id', updateClub);
clubRouts.post('/join/:id', authMiddleware, joinClub);
clubRouts.post('/leave/:id', authMiddleware, leaveClub);
clubRouts.delete('/:id', deleteClub);


export default clubRouts;