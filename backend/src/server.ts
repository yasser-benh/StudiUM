import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import connectDB from './config/db';
import appRoutes from './appRoutes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const uploadsPath = path.join(__dirname, 'uploads');
console.log("🛠 Servant les fichiers depuis :", uploadsPath);



const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {  
   
    await connectDB()
    appRoutes(app)
    console.log(`Server is running on port ${PORT}`)
    
} )