import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiLock, FiMail, FiMapPin, FiPhone, FiUser, FiUserPlus, FiUpload } from "react-icons/fi";
import avatar from "../../../assets/student-avatar-user-profile-icon-vector-47025187 2.jpg";
import Title from "../../../components/Titles";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    phoneNumber: "",
    birthDate: "",
    role: "etudiant"
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(avatar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (avatarFile) formDataToSend.append("avatar", avatarFile);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création de l'utilisateur");
      }

      alert("Utilisateur créé avec succès !");
      navigate("/utilisateurs");
    } catch (error: any) {
      console.error("Erreur :", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(avatar);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-12 px-4 sm:px-6 lg:px-8"
    >
       <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full">
        <Title text="Ajouter un utilisateur " />
      </motion.div>
      <div className="max-w-4xl mx-auto">
        

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="md:flex">
            {/* Section Avatar */}
            <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale:0.6}}
                animate={{ opacity: 1 , scale:1}}
               
                className="relative group"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatarUpload"
                  onChange={handleAvatarChange}
                />
                <label 
                  htmlFor="avatarUpload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 120 }}
                    src={preview}
                    alt="Avatar Preview"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(111, 66, 193, 0.8)" }}
                    className="mt-4 px-6 py-2 bg-[#6F42C1] text-white rounded-lg font-medium flex items-center"
                  >
                    <FiUpload className="mr-2" />
                    Changer la photo
                  </motion.div>
                </label>
              </motion.div>
            </div>

            {/* Section Formulaire */}
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="mr-2 text-[#6F42C1]" /> Prénom
                    </label>
                    <motion.input
                      type="text"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                      value={formData.firstName}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="mr-2 text-[#6F42C1]" /> Nom
                    </label>
                    <motion.input
                      type="text"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                      value={formData.lastName}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FiCalendar className="mr-2 text-[#6F42C1]" /> Date de naissance
                  </label>
                  <motion.input
                    type="date"
                    name="birthDate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                    value={formData.birthDate}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FiMail className="mr-2 text-[#6F42C1]" /> Email
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                    value={formData.email}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FiLock className="mr-2 text-[#6F42C1]" /> Mot de passe
                  </label>
                  <motion.input
                    type="password"
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                    value={formData.password}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMapPin className="mr-2 text-[#6F42C1]" /> Ville
                    </label>
                    <motion.input
                      type="text"
                      name="city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                      value={formData.city}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiPhone className="mr-2 text-[#6F42C1]" /> Téléphone
                    </label>
                    <motion.input
                      type="text"
                      name="phoneNumber"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FiUserPlus className="mr-2 text-[#6F42C1]" /> Rôle
                  </label>
                  <motion.select
                    name="role"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F42C1] focus:border-[#6F42C1] transition"
                    value={formData.role}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="etudiant">Étudiant</option>
                    <option value="admin">Administrateur</option>
                    <option value="responsable_club">Responsable Club</option>
                    <option value="responsable_club">President</option>
                  </motion.select>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(111, 66, 193, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full mt-6 py-3 text-white rounded-lg font-medium transition ${
                    isSubmitting ? 'bg-[#6F42C1]/70' : 'bg-[#6F42C1] hover:bg-[#5a36a8]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </span>
                  ) : (
                    "Créer le compte"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateUser;