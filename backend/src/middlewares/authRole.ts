import { AuthRequest } from "./authMiddleware";
import { Response, NextFunction } from "express";



export const roleGuard = (allowedRoles: string[] ) => {
    return (req: AuthRequest , res: Response , next: NextFunction) => {
        if (!req.user) {
            res.status(401).send({ message: "You are not authorized to perform this action" });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(401).send({ message: "You are not authorized to perform this action" });
            return;
      
    }
    next();
} }