import { Request , Response } from "express";
import Announce from "../models/Announce.model";
import {AuthRequest} from "../middlewares/authMiddleware";

export const createAnnounce = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log("Corps de la requête:", req.body);
        console.log("Utilisateur authentifié:", req.user);

        const { title, content, category } = req.body;

        // Vérifier si req.user.userId est bien défini
       

        const newAnnounce = new Announce({
            title,
            content,
            category,
            
        });

        await newAnnounce.save();
        res.status(201).json(newAnnounce);
    } catch (error:any) {
        console.error("Erreur lors de la création de l'annonce :", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const getAllAnnounces = async (req: Request , res: Response) => {
    try {
        const announces = await Announce.find().populate("createdBy" , "name email");
        res.status(200).json(announces)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }
}


export const getAnnounceById = async (req: Request , res: Response) => {
    try {
        const {id} = req.params;
        const announce = await Announce.findById(id)
        if(!announce) {
            res.status(404).json({message : "User not found"})
            return
        }
        res.status(200).json(announce)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
} }


export const updateAnnounces = async (req: Request , res: Response) => {
    try {
        const {id} = req.params;
        const {title , content , category } = req.body;

        const announce = await Announce.findById(id)
        if(!announce) {
            res.status(404).json({message : "Announce not found"})
            return
        }

        if(title) announce.title = title;
        if(content) announce.content = content;
        if (category) announce.category = category;
        
        await announce.save();
        res.status(200).json(announce)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
        
    }
}


export const deleteAnnounce = async (req: AuthRequest , res: Response):Promise<void> => {
    try {
       

        const announce = await Announce.findById(req.params.id);
        if(!announce) {
             res.status(404).json({message : "Announce not found"})
             return
        }
        await announce.deleteOne();
        res.status(200).json({message : "Announce deleted"})
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
        
    }
}