import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FiEdit, FiTrash2, FiSave, FiX, FiChevronLeft, FiChevronRight, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiUserPlus } from "react-icons/fi";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  role: string;
  city: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  clubs: string[];
  events: { name: string; date: string }[];
}

interface Props {
  user: User;
}

const UserCard = ({ user }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  
  const navigate = useNavigate();

  const formatBirthDate = (date: string) => {
    const formattedDate = new Date(date);
    return format(formattedDate, 'dd/MMM/yyyy');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Utilisateur mis à jour avec succès !");
        setIsEditing(false);
        setIsFlipped(false);
      } else {
        throw new Error("Erreur lors de la mise à jour.");
      }
    } catch (error: any) {
      alert(`Erreur lors de la mise à jour: ${error.message}`);
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${user._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Utilisateur supprimé avec succès !");
        navigate("/admin/users");
      } else {
        throw new Error("Erreur lors de la suppression.");
      }
    } catch (error: any) {
      alert(`Erreur lors de la suppression: ${error.message}`);
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-6">
      <motion.div
        className="relative w-full max-w-3xl h-[28rem] perspective-1000"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* --- FRONT CARD --- */}
        <motion.div 
          className="absolute w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 flex flex-col backface-hidden"
         
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Studi<span className="text-[#6F42C1]">UM</span>
            </h1>
            <p className="text-gray-500 mt-1">Profil Utilisateur</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center flex-grow">
            <div className="relative group">
              <img
                src={
                  user.avatar
                    ? `http://localhost:3000${user.avatar}`
                    : "https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg"
                }
                alt="Avatar"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#6F42C1] text-white p-2 rounded-full cursor-pointer shadow-md">
                  <FiEdit className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            <div className="flex-grow">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <FiUser className="text-[#6F42C1]" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#6F42C1] outline-none"
                      placeholder="Prénom"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <FiUser className="text-[#6F42C1]" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#6F42C1] outline-none"
                      placeholder="Nom"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-[#6F42C1]" />
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#6F42C1] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <FiUserPlus className="text-[#6F42C1]" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#6F42C1] outline-none bg-transparent"
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="admin">Administrateur</option>
                      <option value="responsable_club">Responsable Club</option>
                    </select>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar />
                    <span>{formatBirthDate(user.birthDate)}</span>
                  </div>
                  <div className="mt-4">
                    <span className="inline-block px-3 py-1 bg-[#6F42C1]/10 text-[#6F42C1] rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEditing ? 'bg-gray-200 text-gray-700' : 'bg-[#6F42C1]/10 text-[#6F42C1]'}`}
            >
              {isEditing ? <FiX /> : <FiEdit />}
              {isEditing ? "Annuler" : "Modifier"}
            </motion.button>

            <motion.button
              onClick={() => setIsFlipped(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#6F42C1] text-white rounded-lg"
            >
              Plus d'infos <FiChevronRight />
            </motion.button>
          </div>
        </motion.div>

        {/* --- BACK CARD --- */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-[#6F42C1] to-[#8B5CF6] rounded-2xl shadow-lg p-6 flex flex-col backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white">
              Détails <span className="text-gray-200">Utilisateur</span>
            </h1>
          </div>

          <div className="flex-grow space-y-5 text-white">
            {isEditing ? (
              <>
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-white" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 border-b border-white/30 focus:border-white outline-none placeholder-white/70"
                    placeholder="Ville"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-white" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 border-b border-white/30 focus:border-white outline-none placeholder-white/70"
                    placeholder="Email"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-white" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 border-b border-white/30 focus:border-white outline-none placeholder-white/70"
                    placeholder="Téléphone"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-white" />
                  <span>{user.city || "Non spécifié"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-white" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-white" />
                  <span>{user.phoneNumber || "Non spécifié"}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <motion.button
              onClick={() => setIsFlipped(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg backdrop-blur-sm"
            >
              <FiChevronLeft /> Retour
            </motion.button>

            {isEditing && (
              <motion.button
                onClick={handleUpdate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#6F42C1] rounded-lg"
              >
                <FiSave /> Sauvegarder
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mt-6"
        >
          <motion.button
            onClick={handleUpdate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md"
          >
            <FiSave /> Enregistrer
          </motion.button>
          <motion.button
            onClick={() => setIsEditing(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md"
          >
            <FiX /> Annuler
          </motion.button>
        </motion.div>
      )}

      <motion.div className="flex gap-4 mt-6">
        <motion.button
          onClick={handleDelete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md"
        >
          <FiTrash2 /> Supprimer
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UserCard;