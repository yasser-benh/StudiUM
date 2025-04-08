import express from "express";
import { createAnnounce, deleteAnnounce, getAllAnnounces, getAnnounceById, updateAnnounces } from "../controllers/annonce.Controller";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleGuard } from "../middlewares/authRole";

const announceRoutes = express.Router();

announceRoutes.post("/",  createAnnounce);
announceRoutes.get("/", getAllAnnounces);
announceRoutes.get("/:id", getAnnounceById);
announceRoutes.put("/:id", authMiddleware,roleGuard(['admin' , 'responsable_club']), updateAnnounces);
announceRoutes.delete("/:id", authMiddleware,roleGuard(['admin' , 'responsable_club']), deleteAnnounce);
export default announceRoutes