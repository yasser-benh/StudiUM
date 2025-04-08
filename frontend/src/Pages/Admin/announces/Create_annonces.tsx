import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../../components/Titles";
import { motion } from "framer-motion";
import { FiCalendar, FiTag, FiType, FiEdit2 } from "react-icons/fi";

const CreateAnnouncePage = () => {
  const [formData, setFormData] = useState({ 
    title: "", 
    content: "", 
    category: "", 
    date: "" 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/announces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de la création de l'annonce");
      alert("Annonce créée avec succès !");
      navigate("/annonces");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  py-8 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full">
        <Title text="Créer une Annonces " />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 , delay:0.3}}
        className="max-w-2xl mx-auto"
      >
        

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700">
                <FiType className="mr-2" /> Titre de l'annonce
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Ex: Réunion des étudiants le 15 juin"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
                <FiEdit2 className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Contenu */}
            <div className="space-y-2">
              <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700">
                <FiEdit2 className="mr-2" /> Contenu détaillé
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="Décrivez votre annonce en détail..."
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[150px]"
                rows={4}
                required
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
                <FiTag className="mr-2" /> Catégorie
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="académique">Académique</option>
                  <option value="étudiant">Étudiant</option>
                  <option value="Offre de stage">Offre de stage</option>
                  <option value="administrative">Administrative</option>
                  <option value="associatif">Associatif</option>
                  <option value="Autre..">Autre..</option>
                </select>
                <FiTag className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700">
                <FiCalendar className="mr-2" /> Date pertinente
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
                <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Bouton de soumission */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </span>
              ) : (
                "Publier l'annonce"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateAnnouncePage;