import { Request , Response } from "express";
import  Event  from "../models/Event.model";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, date_start, date_end, location, eventType, eventImage } = req.body;

        if (!title || !description || !date_start || !date_end || !location || !eventType) {
            res.status(400).json({ message: "Tous les champs sont obligatoires" });
            return
        }

        // ✅ Vérifier si les dates sont valides
        const startDate = new Date(date_start); 
        const endDate = new Date(date_end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
           res.status(400).json({ message: "Format de date invalide" });
           return
        }

        // ✅ Création de l'événement avec des dates valides
        const newEvent = new Event({
            title,
            description,
            date_start: startDate,
            date_end: endDate,
            location,
            eventType,
            eventImage,
        });

        await newEvent.save();
        res.status(201).json(newEvent);

    } catch (error) {
        console.error("Erreur lors de la création de l'événement :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'événement" });
    }
};



export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().populate('createdBy' , 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error in fetching events" });
        
    }
}

export const getEventById = async (req: Request , res: Response) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId).populate('participants' , 'name email');
        if(!event) {
            res.status(404).json({message : "event not found"})
            return
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
} }

export const updateEvent = async (req: AuthRequest , res: Response) => {
    try {
        
        const {id} = req.params;
        

        const event = await Event.findByIdAndUpdate(id , req.body , {new : true});
        if(!event) {
            res.status(404).json({message : "Event not found"})
            return
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }
}

export const deleteEvent = async (req: AuthRequest , res: Response) => {
    try {
        const {id} = req.params;
        const event = await Event.findByIdAndDelete(id);
        if(!event) {
            res.status(404).json({message : "Event not found"})
            return
        }
        await event.deleteOne();
        res.status(200).json({message : "Event deleted"})
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }
}