import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiSave, FiX, FiUser, FiMail, FiUsers, FiCalendar, FiTag } from "react-icons/fi";
import defaultLogo from "../../../assets/4141669-aucune-photo-ou-image-blanche-icone-chargement-images-ou-image-manquante-marque-image-non-disponible-ou-image-coming-soon-sign-simple-nature-silhouette-in-frame-illustrationle-isolee-vectoriel.jpg";

interface Club {
  _id: string;
  name: string;
  description: string;
  president: string;
  email: string;
  logo?: string;
  category: string;
  members: string[];
  events?: { name: string; date: string }[];
}

interface President {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  club: Club;
}

const ClubCard = ({ club }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(club);
  const [presidentMap, setPresidentMap] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresidents = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/presidents");
        if (!res.ok) throw new Error("Erreur lors du chargement des présidents");
        const presidents: President[] = await res.json();

        const map = presidents.reduce((acc, pres) => {
          acc[pres._id] = `${pres.firstName} ${pres.lastName}`;
          return acc;
        }, {} as Record<string, string>);

        setPresidentMap(map);
      } catch (error) {
        console.error("Erreur lors du chargement des présidents :", error);
      }
    };

    fetchPresidents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/clubs/${club._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Club mis à jour avec succès !");
        setIsEditing(false);
      } else {
        throw new Error("Erreur lors de la mise à jour.");
      }
    } catch (error: any) {
      alert(`Erreur lors de la mise à jour: ${error.message}`);
      console.error("Error updating club:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce club ?")) return;

    try {
      const res = await fetch(`http://localhost:3000/clubs/${club._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Club supprimé avec succès !");
        navigate("/clubs");
      } else {
        throw new Error("Erreur lors de la suppression.");
      }
    } catch (error: any) {
      alert(`Erreur lors de la suppression: ${error.message}`);
      console.error("Error deleting club:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Club Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative group">
              <img
                src={club.logo ? `http://localhost:3000/${club.logo}` : defaultLogo}
                alt="Club Logo"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-[#6F42C1] text-white p-2 rounded-full shadow-md">
                  <FiEdit className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex-grow">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-3xl font-semibold border-b border-gray-300 focus:border-[#6F42C1] outline-none"
                  />
                  <div className="flex items-center gap-3">
                    <FiTag className="text-[#6F42C1]" />
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-1 border-b border-gray-300 focus:border-[#6F42C1] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <FiUser className="text-[#6F42C1]" />
                    <select
                      name="president"
                      value={formData.president}
                      onChange={handleChange}
                      className="w-full px-3 py-1 border-b border-gray-300 focus:border-[#6F42C1] outline-none bg-transparent"
                    >
                      {Object.entries(presidentMap).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="text-[#6F42C1]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-1 border-b border-gray-300 focus:border-[#6F42C1] outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-semibold text-gray-800">{club.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <FiTag className="text-[#6F42C1]" />
                    <span className="text-lg text-gray-600">{club.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <FiUser className="text-[#6F42C1]" />
                    <span className="text-sm text-gray-500">
                      Président : {presidentMap[club.president] || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <FiMail className="text-[#6F42C1]" />
                    <span className="text-sm text-gray-500">Email : {club.email}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Description</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-transparent transition min-h-[150px]"
              placeholder="Décrivez votre club..."
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-line">{club.description}</p>
          )}
        </motion.div>

        {/* Members Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">Membres</h3>
            <span className="bg-[#6F42C1]/10 text-[#6F42C1] px-3 py-1 rounded-full text-sm font-medium">
              {club.members.length} membres
            </span>
          </div>
          
          {club.members.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {club.members.map((member, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiUser className="text-[#6F42C1]" />
                  <span className="text-gray-600">{member}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun membre ajouté.</p>
          )}
        </motion.div>

        {/* Events Section */}
        {club.events && club.events.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Événements</h3>
              <span className="bg-[#6F42C1]/10 text-[#6F42C1] px-3 py-1 rounded-full text-sm font-medium">
                {club.events.length} événements
              </span>
            </div>
            
            <ul className="space-y-3">
              {club.events.map((event, index) => (
                <li key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-[#6F42C1] text-white p-2 rounded-full">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end gap-4"
        >
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg ${isEditing ? 'bg-gray-200 text-gray-700' : 'bg-[#6F42C1] text-white'}`}
          >
            {isEditing ? <FiX /> : <FiEdit />}
            {isEditing ? "Annuler" : "Modifier"}
          </motion.button>

          {isEditing && (
            <motion.button
              onClick={handleUpdate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg"
            >
              <FiSave /> Sauvegarder
            </motion.button>
          )}

          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            <FiTrash2 /> Supprimer
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClubCard;