import React from "react";
import { FaUserCircle, FaBlog, FaFileAlt, FaComments, FaUsers } from "react-icons/fa";

const Sidebar = ({ user, active, setActive }) => {
  const menuItems = [
    { name: "blogs", icon: <FaBlog /> },
    { name: "articles", icon: <FaFileAlt /> },
    { name: "threads", icon: <FaComments /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 fixed h-screen flex flex-col justify-between shadow-lg">
      {/* Top Section */}
      <div>
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-200 tracking-wide">
          Dashboard
        </h1>

        {/* User Info */}
        <div className="mb-8 flex items-center gap-3 bg-gray-700 p-3 rounded-lg shadow-inner">
          <FaUserCircle className="text-4xl text-gray-300" />
          {user && (
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-300 truncate">{user.email}</p>
              <p className="text-xs text-green-400">{user.role?.toUpperCase()}</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:text-white ${
                active === item.name ? "bg-gray-700 text-white shadow-lg" : "text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="capitalize">{item.name}</span>
            </button>
          ))}

          {/* Superadmin User Management */}
          {user?.role === "superadmin" && (
            <button
              onClick={() => setActive("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium mt-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:text-white ${
                active === "users" ? "bg-gray-700 text-white shadow-lg" : "text-gray-200"
              }`}
            >
              <FaUsers className="text-lg cursor-pointer" />
              <span>Manage Users</span>
            </button>
          )}
        </nav>
      </div>

      {/* Footer / Branding */}
      <div className="text-gray-400 text-xs text-center mt-6">
        &copy; {new Date().getFullYear()} My Dashboard
      </div>
    </aside>
  );
};

export default Sidebar;
