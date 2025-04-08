import mongoose from "mongoose";


export interface Event extends mongoose.Document {
    title: string;
    description: string;
    date_start: Date;
    date_end:Date
    location: string;
    eventType :string
    createdBy : mongoose.Schema.Types.ObjectId;
    eventImage? : string;
    participants? : mongoose.Schema.Types.ObjectId[];

}

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date_start: { type: Date, required: true },
    date_end: { type: Date, required: true },
    location: { type: String, required: true },
    eventType: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    eventImage: { type: String , default:null },
    participants: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }

}, { timestamps: true });

export default mongoose.model<Event>("Event", EventSchema);