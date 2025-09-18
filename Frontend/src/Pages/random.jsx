import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../api";
import ContentSection from "../Components/ContentSection";
import UserManagement from "../Components/UserManagement";
import Sidebar from "../Components/SideBar";
import { FaTable, FaThLarge } from "react-icons/fa";

const Dashboard = () => {
  const [active, setActive] = useState("blogs");
  const [view, setView] = useState("grid");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/home");

      try {
        const res = await Api.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // user profile
        setUser(res.data.user);

        // if role is "user", redirect them to home
        if (res.data.user.role === "user") return navigate("/home");

        // content comes bundled in response
        setBlogs(res.data.content.blogs || []);
        setArticles(res.data.content.articles || []);
        setThreads(res.data.content.forumThreads || []);

        // only superadmin gets all users
        if (res.data.user.role === "superadmin") {
          const u = await Api.get("/superadmin/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(u.data.users || []);
        }
      } catch (err) {
        console.error("Error fetching /me:", err);
        navigate("/home");
      }
    };

    fetchData();
  }, [navigate]);

  const changeRole = async (id, role) => {
    await Api.patch(`/superadmin/users/edit/${id}`, { role }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const removeUser = async (id) => {
    await Api.delete(`/superadmin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} active={active} setActive={setActive} />
      <main className="flex-1 p-8 ml-64 overflow-y-auto h-screen">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold capitalize">{active}</h2>
          <button
            onClick={() => setView(view === "grid" ? "table" : "grid")}
            className="bg-gray-200 px-3 py-2 rounded-lg"
          >
            {view === "grid" ? <FaTable /> : <FaThLarge />}
          </button>
        </div>

        {["blogs", "articles", "threads"].includes(active) && (
          <ContentSection
            type={active}
            data={{ blogs, articles, threads }[active]}
            user={user}
            setData={{
              blogs: setBlogs,
              articles: setArticles,
              threads: setThreads,
            }[active]}
            view={view}
            users={users}
          />
        )}

        {active === "users" && user?.role === "superadmin" && (
          <UserManagement
            users={users}
            view={view}
            changeRole={changeRole}
            removeUser={removeUser}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
