import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ role }: { role: "admin" | "etudiant" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const adminLinks = [
    { name: "Accueil", path: "/accueil" },
    { name: "Utilisateurs", path: "/utilisateurs" },
    { name: "Clubs", path: "/clubs" },
    { name: "Annonces", path: "/annonces" },
    { name: "Événements", path: "/event" },
  ];

  const etudiantLinks = [
    { name: "Accueil", path: "/accueil" },
    { name: "Profil", path: "/profile" },
    { name: "Mes Clubs", path: "/clubs" },
    { name: "Annonces", path: "/annonces" },
    { name: "Événements", path: "/event" },
  ];

  const linkArr = role === "admin" ? adminLinks : etudiantLinks;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 m-4 bg-gray-800 text-white rounded-md focus:outline-none cursor-pointer hover:scale-110 duration-200"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: isOpen ? 1 : 0, opacity: isOpen ? 1 : 1 }}
        transition={{ type: "spring" }}
        className={`bg-[#F8F9FA] text-white h-full w-72 
          fixed top-0 left-0 lg:block 
          ${isOpen ? "absolute translate-x-0 " : "hidden lg:translate-x-0"}`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white"
        >
          <X size={24} className="text-black my-3 cursor-pointer hover:rotate-90 duration-500" />
        </button>

        <div className="text-3xl font-bold text-[#212529] text-center p-22">
          Studi<span className="text-[#6F42C1]">UM</span>
        </div>

        <div className="flex flex-col gap-5 mx-15 my-10 text-black font-extralight text-xl ">
          {linkArr.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                ` duration-200
                ${isActive ? "text-[#6F42C1] font-bold" : "hover:text-[#6F42C1] hover:font-medium"}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
