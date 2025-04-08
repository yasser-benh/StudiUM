import { Request , Response } from "express";
import Club from "../models/Club.model";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createClub = async (req: Request, res: Response) => {
    try {
        console.log('Data reçue :', req.body); // Affiche les données du formulaire (nom, description, etc.)
        console.log('Logo reçu :', req.file);  // Affiche le fichier téléchargé (logo)

        const { name, description, category, email, president, type } = req.body;
        const logo = req.file ? req.file.path : null;  // Si un fichier logo est envoyé, prends son chemin

        // Validation des champs requis
        

        // Création du club
        const newClub = new Club({
            name,
            description,
            category,
            email,
            president,
            type,
            members: [],  // Si tu veux ajouter des membres plus tard
            logo: req.file ? `/uploads/avatars/${req.file.filename}` : ""
        });

        // Sauvegarde du club dans la base de données
        await newClub.save();

        res.status(201).json(newClub);  // Réponse avec le club créé
    } catch (error) {
        console.error('Erreur lors de la création du club:', error);
        res.status(500).json({ message: "Erreur lors de la création du club" });
    }
};



export const getAllClubs = async (req: Request, res: Response) => {
    try {
        const clubs = await Club.find().populate('members' , 'name email');
        res.status(200).send(clubs);
    } catch (error) {
        res.status(500).send({ message: "Error in fetching clubs" });
        
    }
}

export const getClubById = async (req: Request , res: Response) => {
    try {
        const clubId = req.params.id;
        const club = await Club.findById(clubId).populate('members' , 'name email');
        if(!club) {
            res.status(404).json({message : "Club not found"})
            return
        }
        res.status(200).json(club)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
} }
export const updateClub = async (req: AuthRequest , res: Response) => {
    try {
        
        const {id} = req.params;
       const club = await Club.findByIdAndUpdate(id , req.body , {new : true});

       
        if(!club) {
            res.status(404).json({message : "Club not found"})
            return
        }

        
        
        await club.save();
        res.status(200).json(club)
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
        
    }
}

export const joinClub = async (req: AuthRequest, res: Response) => {
    try {
   
        const club = await Club.findById(req.params.id);
        if(!club) {
            res.status(404).send({ message: "Club not found" });
            return;
        }

        if(club.members.includes(req.user.userId)) {
            res.status(400).send({ message: "You are already a member of this club" });
            return;
        }

        club.members.push(req.user.userId);
        await club.save();
        res.status(200).send({message : "You have joined the club."});
    } catch (error) {
        res.status(500).send({ message: "Error in joining club" });
        
    }
}

export const leaveClub = async (req: AuthRequest, res: Response) => {
    try {
    
        const club = await Club.findById(req.params.id);
        if(!club) {
            res.status(404).send({ message: "Club not found" });
            return;
        }

        if(!club.members.includes(req.user.userId)) {
            res.status(400).send({ message: "You are not a member of this club" });
            return;
        }

        club.members = club.members.filter(member => member.toString() !== req.user.userId.toString());
        await club.save();
        res.status(200).send({message : "You have left the club."});
    } catch (error) {
        res.status(500).send({ message: "Error in leaving club" });
        
    }
}

export const deleteClub = async (req: AuthRequest, res: Response) => {
    try {
       

        const club = await Club.findByIdAndDelete(req.params.id);
        if(!club) {
            res.status(404).send({ message: "Club not found" });
            return;
        }
        await club.deleteOne()
        res.status(200).send({message : "Club deleted successfully."});

    } catch (error) {
        res.status(500).json({ message: "Error in deleting club" });
        
    }
}