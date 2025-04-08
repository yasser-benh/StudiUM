import mongoose from "mongoose";

export type Role = "admin" | "etudiant" | "responsable_club" | "president";


export interface User extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar?: string;
    city?: string;
    phoneNumber?: string;
    birthDate?: Date;
    clubs?: string[];
    events?: { name: string; date: string }[];
    role: Role[];
    createdAt: Date;
}

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: "" }, 
        city: { type: String, default: "" }, 
        birthDate: { type: Date, default: null },
        clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
        events: [{ name: String, date: Date }],
        phoneNumber: { type: String, default: "" }, 
        role: { type: [String], enum: ["admin", "etudiant", "responsable_club", "president"], default: ["etudiant"] },
    },
    { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
