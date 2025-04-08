import express from "express";
import { createEvent,  deleteEvent,  getAllEvents, getEventById, updateEvent } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleGuard } from "../middlewares/authRole";

const eventRoutes = express.Router();

eventRoutes.post("/",createEvent);
eventRoutes.get("/", getAllEvents);
eventRoutes.get("/:id", getEventById);
eventRoutes.put("/:id", updateEvent);
eventRoutes.delete("/:id", deleteEvent);

export default eventRoutes