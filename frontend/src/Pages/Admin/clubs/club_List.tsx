import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiUsers, FiMail, FiUser, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import defaultLogo from "../../../assets/4141669-aucune-photo-ou-image-blanche-icone-chargement-images-ou-image-manquante-marque-image-non-disponible-ou-image-coming-soon-sign-simple-nature-silhouette-in-frame-illustrationle-isolee-vectoriel.jpg";

type Club = {
  _id: string;
  name: string;
  description: string;
  president: string;
  email: string;
  logo?: string;
  category: string;
  members: string[];
};

type President = {
  _id: string;
  firstName: string;
  lastName: string;
};

const fetchClubs = async (): Promise<Club[]> => {
  const response = await fetch("http://localhost:3000/clubs");
  if (!response.ok) throw new Error("Échec de récupération des clubs");
  return await response.json();
};

const fetchPresidents = async (): Promise<President[]> => {
  const response = await fetch("http://localhost:3000/users/presidents");
  if (!response.ok) throw new Error("Échec de récupération des présidents");
  return await response.json();
};

const ClubsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [presidentMap, setPresidentMap] = useState<Record<string, string>>({});

  const { 
    data: clubs = [], 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });

  const { data: presidents = [] } = useQuery({
    queryKey: ["presidents"],
    queryFn: fetchPresidents,
  });

  useEffect(() => {
    if (presidents.length > 0) {
      const map = presidents.reduce((acc, pres) => {
        acc[pres._id] = `${pres.firstName} ${pres.lastName}`;
        return acc;
      }, {} as Record<string, string>);
      setPresidentMap(map);
    }
  }, [presidents]);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F42C1]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
      <p>Erreur : {error.message}</p>
    </div>
  );

  return (
    <div className="w-full p-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un club..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1] focus:border-transparent transition"
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/create_club"
            className="flex items-center gap-2 px-6 py-3 bg-[#6F42C1] text-white rounded-xl hover:bg-[#5a36a8] transition shadow-md"
          >
            <FiPlus className="text-lg" />
            <span>Ajouter un club</span>
          </Link>
        </motion.div>
      </div>

      {/* Clubs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 items-center p-4 bg-[#F8F9FA] border-b border-gray-200 gap-4 font-medium text-gray-700">
          <div className="col-span-2">Logo</div>
          <div className="col-span-3">Nom</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-2">Président</div>
          <div className="col-span-2">Catégorie</div>
          <div className="col-span-1">Membres</div>
        </div>

        {/* Table Body */}
        {filteredClubs.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredClubs.map((club) => (
              <motion.li
                key={club._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 items-center p-4 hover:bg-gray-50 gap-4 cursor-pointer"
                onClick={() => navigate(`/admin/club/${club._id}`)}
              >
                <div className="col-span-2">
                  <img
                    src={club.logo ? `http://localhost:3000${club.logo}` : defaultLogo}
                    alt="Logo"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                </div>
                <div className="col-span-3 font-medium text-gray-900 truncate">
                  {club.name || "N/A"}
                </div>
                <div className="col-span-2 text-gray-600 truncate flex items-center gap-2">
                  <FiMail className="text-[#6F42C1]" />
                  {club.email || "N/A"}
                </div>
                <div className="col-span-2 text-gray-600 truncate flex items-center gap-2">
                  <FiUser className="text-[#6F42C1]" />
                  {presidentMap[club.president] || "N/A"}
                </div>
                <div className="col-span-2 text-gray-600 truncate flex items-center gap-2">
                  <FiTag className="text-[#6F42C1]" />
                  {club.category || "N/A"}
                </div>
                <div className="col-span-1 text-gray-600 truncate flex items-center gap-2">
                  <FiUsers className="text-[#6F42C1]" />
                  {club.members?.length || 0}
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Aucun club trouvé
          </div>
        )}
      </div>

      {/* Pagination (optional) */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <div>Affichage de {filteredClubs.length} sur {clubs.length} clubs</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Précédent</button>
          <button className="px-3 py-1 border rounded bg-[#6F42C1] text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Suivant</button>
        </div>
      </div>
    </div>
  );
};

export default ClubsList;