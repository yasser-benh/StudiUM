import {Express} from 'express';
import authRoutes from './routes/authRoutes';
import announceRoutes from './routes/annonceRoutes';
import userRoutes from './routes/userRoutes';
import clubRouts from './routes/clubRoutes';
import eventRoutes from './routes/eventRoutes';

function appRoutes(app:Express) {
    app.use('/auth' , authRoutes )
    app.use('/users' , userRoutes)
    app.use('/announces' , announceRoutes)
    app.use('/clubs' , clubRouts)
    app.use('/events' ,eventRoutes)
   
}

export default appRoutes