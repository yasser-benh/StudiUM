import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUpload, FiUser, FiMail, FiInfo, FiUsers, FiTag, FiAward } from "react-icons/fi";

import defaultAvatar from "../../../assets/4141669-aucune-photo-ou-image-blanche-icone-chargement-images-ou-image-manquante-marque-image-non-disponible-ou-image-coming-soon-sign-simple-nature-silhouette-in-frame-illustrationle-isolee-vectoriel.jpg";
import Title from "../../../components/Titles";



const CreateClub = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [president, setPresident] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("club");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultAvatar);

  const [presidents, setPresidents] = useState<any[]>([]);  

  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchPresidents = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/presidents");
        const data = await response.json();
        setPresidents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des présidents", error);
      }
    };
    fetchPresidents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    

    
      const formData = new FormData();
      console.log({ name, description, email, president, category, type });
      formData.append("name", name);
      formData.append("description", description);
      formData.append("email", email);
      formData.append("president", president); 
      formData.append("category", category); 
      formData.append("type", type);
    

      
      if (logo) {formData.append("logo", logo)

        
      }
      
      
      try{
      const response = await fetch("http://localhost:3000/clubs", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création du club/association");
      }

      alert("Club/association créé avec succès !");
      navigate("/clubs");
    } catch (error: any) {
      console.error("Erreur :", error);
      alert(error.message);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    
    } else {
      setPreview(defaultAvatar);
      
    }
  };

  return (
    <div className="w-full  py-8 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full">
        <Title text="Créer un Club ou une Association" />
      </motion.div>
      <div className=" py-12 px-4 sm:px-6 lg:px-8">
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 , delay:0.5}}   
    className="max-w-2xl mx-auto"
  >
    <div className="text-center mb-8">
      
      <p className="mt-2 text-gray-600">Remplissez les détails pour enregistrer votre organisation</p>
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-xl shadow-sm "
    >
      {/* Upload de logo */}
      <div className="flex flex-col items-center mb-4">
        <input type="file" accept="image/*" className="hidden" id="logoUpload" onChange={handleLogoChange} />
        <label htmlFor="logoUpload" className="cursor-pointer group">
          <div className="relative">
            <motion.img 
              src={preview} 
              alt="Logo Preview" 
              className="w-32 h-32 object-cover border-2 border-dashed border-gray-300 rounded-full shadow-md group-hover:border-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 rounded-full p-3 text-white">
                <FiUpload className="w-6 h-6" />
              </div>
            </div>
          </div>
          
        </label>
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Nom du Club/Association */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
            <FiAward className="mr-2" /> Nom du Club/Association
          </label>
          <input 
            type="text" 
            id="name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Ex: Club de Robotique"
            required 
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
            <FiInfo className="mr-2" /> Description
          </label>
          <textarea 
            id="description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[120px]"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Décrivez les activités et objectifs de votre organisation..."
            required 
          />
        </div>

        {/* Email de Contact */}
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
            <FiMail className="mr-2" /> Email de Contact
          </label>
          <input 
            type="email" 
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="contact@exemple.com"
            required 
          />
        </div>

        {/* Président */}
        <div className="space-y-2">
          <label htmlFor="president" className="flex items-center text-sm font-medium text-gray-700">
            <FiUser className="mr-2" /> Président
          </label>
          <select 
            id="president"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={president} 
            onChange={(e) => setPresident(e.target.value)} 
            required
          >
            <option value="">Sélectionner un président</option>
            {presidents.map((president) => (
              <option key={president._id} value={president._id}>
                {president.firstName} {president.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
            <FiTag className="mr-2" /> Catégorie
          </label>
          <input 
            type="text" 
            id="category"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="Ex: Scientifique, Culturel, Sportif..."
            required 
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="flex items-center text-sm font-medium text-gray-700">
            <FiUsers className="mr-2" /> Type
          </label>
          <select 
            id="type"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="club">Club</option>
            <option value="association">Association</option>
          </select>
        </div>

        {/* Bouton de soumission */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition shadow-md"
        >
          Créer l'organisation
        </motion.button>
      </motion.form>
    </motion.div>
  </motion.div>
</div>
    </div>
  );
};

export default CreateClub;
