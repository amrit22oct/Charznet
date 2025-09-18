import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Sidebar = ({ user, active, setActive }) => (
  <aside className="w-64 bg-black text-white p-6 fixed h-screen">
    <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
    <div className="mb-6 flex items-center gap-3">
      <FaUserCircle className="text-4xl" />
      {user && (
        <div>
          <p>{user.name}</p>
          <p className="text-sm">{user.email}</p>
          <p className="text-xs text-green-400">{user.role?.toUpperCase()}</p>
        </div>
      )}
    </div>
    {["blogs", "articles", "threads"].map((s) => (
      <button key={s} onClick={() => setActive(s)} className={`p-3 rounded block mb-2 ${active === s && "bg-white/20"}`}>
        {s}
      </button>
    ))}
    {user?.role === "superadmin" && (
      <button onClick={() => setActive("users")} className={`p-3 rounded block ${active === "users" && "bg-white/20"}`}>
        Manage Users
      </button>
    )}
  </aside>
);

export default Sidebar;
