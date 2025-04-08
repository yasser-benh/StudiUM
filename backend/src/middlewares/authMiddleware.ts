import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";

export  interface AuthRequest extends Request {
    [x: string]: any;
    user? : any 
    role?: string}

    export const authMiddleware = (req: AuthRequest , res: Response , next: NextFunction) => {
        const token =req.header("Authorization")?.split(" ")[1];

        if (!token) {
            res.status(401).json({message : "Unauthorized"})
            return
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
            req.user = decoded;
            next()
        } catch (error) {
            res.status(401).json({message : "Unauthorized"})
        }
    }