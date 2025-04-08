import { Request , Response } from "express";
import User from "../models/User.Model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {format, formatWithOptions} from "date-fns/fp";
import {fr} from "date-fns/locale";


const formatBirthDate = (date: Date) => {
    // Retourner une date formatée pour l'affichage (au cas où)
    return formatWithOptions({ locale: fr }, 'dd/MMM/yyyy')(date);
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, city, phoneNumber, role, avatar: bodyAvatar, birthDate } = req.body;
        
        // Si birthDate est fourni, on le formate sous Date, sinon on le met à null
        const formattedBirthDate = birthDate ? new Date(birthDate) : null;

        // Vérification de la date et formatage pour l'affichage (côté front, si besoin)
        if (formattedBirthDate) {
            const formattedDate = formatBirthDate(formattedBirthDate);
            console.log(formattedDate); // Affichage comme "06/juin/1996" pour un affichage
        }

        const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : bodyAvatar || "";

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hacher le mot de passe avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            avatar,
            city,
            phoneNumber,
            role,
            clubs: [],
            events: [],
            birthDate: formattedBirthDate, // Sauvegarder la date brute dans la base de données
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async ( req: Request ,res : Response) => {
    try {
        const {email , password} = req.body;
        if(!email || !password) {
            res.status(400).json({message : "Please provide email and password"})
            return
        }
        const user = await User.findOne ({email})
        if(!user) {
            res.status(404).json({message : "User not found"})
            return
        }
       

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(400).json({message : "Invalid credentials"})
            return 
            
        }
        
        const token = jwt.sign({userId: user._id , role: user.role}, process.env.JWT_SECRET_KEY as string, {expiresIn: "7d"});
        res.status(200).json({token , user: {id:user._id , name: user.firstName, email: user.email , role: user.role}})
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
        
    }
}