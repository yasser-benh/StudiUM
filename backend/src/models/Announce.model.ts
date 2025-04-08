import mongoose from "mongoose";

export interface Announce extends mongoose.Document {
    title: string;
    content: string;
    category: string
    createdAt: Date;
    createdBy: mongoose.Schema.Types.ObjectId;

}

const announceSchema = new mongoose.Schema({
    title : {type: String, required: true},
    content : {type: String, required: true},
    category :{type: String, enum: [ "académique" , "étudiant" , "Offre de stage" , "administrative", "associatif" , "Autre.."],required: true},
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}
}, {timestamps: true});

export default mongoose.model<Announce>("Announce", announceSchema);