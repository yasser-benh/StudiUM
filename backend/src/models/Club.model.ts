import mongoose  from "mongoose";

export interface Club extends mongoose.Document {
    name: string;
    description : string;
    category : string;
    members : mongoose.Types.ObjectId[];
    email:string
    president: mongoose.Types.ObjectId;
    logo?: string;
    cover?: string;
    type?: string;
    
   
}

export const ClubSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true},
    description: { type: String, required: true },
    category: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    email: { type: String, required: true },
    president: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    logo: { type: String, default:null},
    cover: { type: String, default:null},
    type: { type: String, enum: ["club", "association"], default: "public" },
} , { timestamps: true });

export default mongoose.model<Club>("Club", ClubSchema);