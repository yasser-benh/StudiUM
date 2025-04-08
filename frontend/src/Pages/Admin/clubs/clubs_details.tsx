import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import Title from "../../../components/Titles";
import { motion } from "framer-motion"; 
import ClubCard from "./club.page";

const AdminClubPage = () => {
  const { id } = useParams(); 
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/clubs/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const data = await response.json();
        setClub(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!club) return <p>Aucune donnée disponible</p>;

  return (
    <div className="w-full">
    <motion.div 
    initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }}   
        transition={{ duration: 0.5 }}  >
      <Title text="Détails de clubs & Assosiations" />
    
    </motion.div>


    <motion.div
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x:0 }}   
      transition={{ duration: 0.5 , delay: 0.4}}   >
          <ClubCard club={club} />
      </motion.div>
    </div>
  );
};

export default AdminClubPage;
