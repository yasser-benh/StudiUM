import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUserPlus, FiEdit, FiTrash2, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

type User = {
  _id: any;
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  avatar?: string;
  role: string;
};

const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const UsersList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const { data: users = [], error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F42C1]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
      <p>Error: {error.message}</p>
    </div>
  );

  return (
    <div className="w-full p-6">
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1] focus:border-transparent transition"
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/create_user"
            className="flex items-center gap-2 px-6 py-3 bg-[#6F42C1] text-white rounded-xl hover:bg-[#5a36a8] shadow-md"
          >
            <FiUserPlus className="text-lg" />
            <span>Ajouter un utilisateur</span>
          </Link>
        </motion.div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 items-center p-4 bg-[#F8F9FA] border-b border-gray-200 gap-4 font-medium text-gray-700">
          <div className="col-span-2">Avatar</div>
          <div className="col-span-2">Nom</div>
          <div className="col-span-2">Prénom</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-1">Téléphone</div>
          <div className="col-span-1">Ville</div>
          <div className="col-span-1">Rôle</div>
          
        </div>

        {/* Table Body */}
        {filteredUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <motion.li
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 items-center p-4 hover:bg-gray-50 gap-4 cursor-pointer"
                onMouseEnter={() => setHoveredUser(user._id)}
                onMouseLeave={() => setHoveredUser(null)}
                onClick={() => navigate(`/admin/user/${user._id}`)}
              >
                
                <div className="col-span-2">
                  <img
                    src={
                      user.avatar
                        ? `http://localhost:3000${user.avatar}`
                        : "https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg"
                    }
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                </div>
                <div className="col-span-2 font-medium text-gray-900 truncate">
                  {user.lastName || "N/A"}
                </div>
                <div className="col-span-2 font-medium text-gray-900 truncate">
                  {user.firstName || "N/A"}
                </div>
                <div className="col-span-2 text-gray-600 truncate">
                  {user.email || "N/A"}
                </div>
                <div className="col-span-1 text-gray-600 truncate">
                  {user.phoneNumber || "N/A"}
                </div>
                <div className="col-span-1 text-gray-600 truncate">
                  {user.city || "N/A"}
                </div>
                <div className="col-span-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin" 
                      ? "bg-purple-100 text-purple-800" 
                      : user.role === "responsable_club" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                  }`}>
                    {user.role || "N/A"}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <motion.button
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                    whileHover={{ scale: 1.1 }}
                    className="p-2 text-gray-500 hover:text-[#6F42C1] transition"
                  >
                    <FiChevronRight className="text-lg" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* Pagination (optional) */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <div>Showing {filteredUsers.length} of {users.length} users</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 border rounded bg-[#6F42C1] text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;