import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/login", { replace: true });
  };
  

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-400 to-black text-white relative overflow-hidden">
      <header className="w-full p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </header>

      <main className="flex flex-col items-center mt-10 gap-6 w-full max-w-4xl px-4">
        <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-xl p-8 w-full flex flex-col md:flex-row items-center gap-6 shadow-lg border border-white border-opacity-20">
          <FaUserCircle className="text-6xl md:text-8xl text-white" />
          <div>
            <h2 className="text-3xl font-semibold mb-2">Welcome, {user.name}!</h2>
            <p className="text-white/80 mb-2">Email: {user.email}</p>
            <p className="text-white/80">Role: {user.role || "User"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          <button
            onClick={() => navigate("/profile")}
            className="bg-black bg-opacity-20 hover:bg-opacity-30 transition p-6 rounded-xl flex flex-col items-center gap-2 shadow-md border border-white border-opacity-20"
          >
            Profile
          </button>

          <button className="bg-black bg-opacity-20 hover:bg-opacity-30 transition p-6 rounded-xl flex flex-col items-center gap-2 shadow-md border border-white border-opacity-20">
            Settings
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 hover:bg-red-600 px-8 py-3 rounded-xl text-lg font-semibold transition"
        >
          Logout
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
