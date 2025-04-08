import { motion } from 'framer-motion';

import Title from "../../../components/Titles";
import AnnounceList from './Annonces_list';


const AnnouncePage = () => {
    

    return (
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}   
          transition={{ duration: 0.5 }}   
        >
          <Title text="Club & Association" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}    
          transition={{ duration: 0.5, delay: 0.4 }} 
        >
          <AnnounceList />

          
        </motion.div>
      </div>
    );
};

export default AnnouncePage;
