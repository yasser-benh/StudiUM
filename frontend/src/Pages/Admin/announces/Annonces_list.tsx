import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import {Link} from "react-router-dom"
import { FiPlus } from "react-icons/fi";

const AnnounceList = () => {
  interface Announce {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
  }

  const [announces, setAnnounces] = useState<Announce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnounces = async () => {
      try {
        const res = await fetch("http://localhost:3000/announces");
        if (!res.ok) throw new Error("Erreur lors du chargement des annonces");
        const data = await res.json();
        setAnnounces(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnounces();
  }, []);

  const breakpoints = {
    default: 3,
    100:2,
    700:1
    
  };

  return (
    <div className="w-full flex flex-col space-y-4">
        <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mur d'annonces</h1>
       <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/create_annonces"
                  
                  className="flex items-center gap-2 px-6 py-3 bg-[#6F42C1] text-white rounded-xl hover:bg-[#5a36a8] transition shadow-md"
                >
                  <FiPlus className="text-lg" />
                  <span>Ajouter Annonces</span>
                </Link>
              </motion.div>
      
        </div>

      {loading ? (
        <p>Chargement des annonces...</p>
      ) : (
        <Masonry
          breakpointCols={breakpoints}
          className="flex gap-4 "
          columnClassName="bg-clip-padding"
        >
          {announces.map((announce, index) => (
            <motion.div
            key={announce._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
              transition: { duration: 0.2 },
              
            }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer relative overflow-hidden"
            style={{ 
              height: index % 3 === 0 ? "280px" : "230px",
              minHeight: "200px",
              maxWidth: "500px",
              margin: "0 auto"
            }}
          >
            {/* Effet de bordure colorée (optionnel) */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#9468e7]"></div>
            
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{announce.title}</h2>
              
              <p className="text-gray-600 mt-2 line-clamp-4 flex-grow">
                {announce.content}
              </p>
              
              <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {new Date(announce.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default AnnounceList;
