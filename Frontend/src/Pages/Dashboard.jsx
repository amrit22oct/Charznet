import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../api";
import ContentSection from "../Components/ContentSection";
import UserManagement from "../Components/UserManagement";
import Sidebar from "../Components/SideBar";
import { FaTable, FaThLarge } from "react-icons/fa";

const Dashboard = () => {
  const [active, setActive] = useState("blogs");
  const [view, setView] = useState("table");
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
        const res = await Api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        if (res.data.user.role === "user") return navigate("/home");

        setBlogs(res.data.content.blogs || []);
        setArticles(res.data.content.articles || []);
        setThreads(res.data.content.forumThreads || []);

        if (res.data.user.role === "superadmin") {
          const usersRes = await Api.get("/superadmin/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(usersRes.data.users || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        navigate("/home");
      }
    };

    fetchData();
  }, [navigate]);

  const changeRole = async (id, role) => {
    await Api.patch(
      `/superadmin/users/edit/${id}`,
      { role },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const removeUser = async (id) => {
    await Api.delete(`/superadmin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fixed */}
      <Sidebar user={user} active={active} setActive={setActive} />

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Toolbar fixed (below navbar) */}
        <div className="flex justify-between items-center p-6 border-b bg-white shadow fixed w-[calc(100%-16rem)] z-20 top-16 h-[72px]">
          <h2 className="text-3xl font-bold capitalize">{active}</h2>

          <div className="flex items-center gap-4">
            {(user?.role === "author" || user?.role === "superadmin") && (
              <button
                onClick={() => navigate(`/create-posts/${active}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition cursor-pointer"
              >
                + Create {active}
              </button>
            )}

            <button
              onClick={() => setView(view === "grid" ? "table" : "grid")}
              className="bg-gray-200 px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              {view === "grid" ? <FaTable /> : <FaThLarge />}
            </button>
          </div>
        </div>

        {/* Scrollable content right below toolbar */}
        <main className="flex-1 overflow-hidden pt-[72px]">
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
    </div>
  );
};

export default Dashboard;
