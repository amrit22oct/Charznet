import React, { Suspense, lazy, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Pages/Footer";

// Lazy-loaded pages (load smoothly with Suspense)
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Home = lazy(() => import("./Pages/Home"));
const Form = lazy(() => import("./Pages/Basic"));
const Profile = lazy(() => import("./Pages/Profile"));
const ArticlePage = lazy(() => import("./Pages/ArticlePage"));
const ArticleDetail = lazy(() => import("./Pages/ArticleDetail"));
const BlogPage = lazy(() => import("./Pages/BlogPage"));
const BlogDetail = lazy(() => import("./Pages/BlogDetail"));
const ForumPage = lazy(() => import("./Pages/ForumPage"));
const ForumDetail = lazy(() => import("./Pages/ForumDetail"));
const PostsPage = lazy(() => import("./Pages/PostsPage"));

// ProtectedRoute HOC
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Simple global loader
const Loader = () => (
  <div className="flex items-center justify-center h-full py-20 text-gray-400 text-lg">
    Loading...
  </div>
);

// AppRoutes component
function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token"));

  const background = state?.background;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          user={user}
          setUser={setUser}
          token={token}
          setToken={setToken}
        />
      </div>

      {/* Main content grows and leaves space for footer */}
      <main className="flex-grow pt-20">
        <Suspense fallback={<Loader />}>
          <Routes location={background || location}>
            {/* Auth */}
            <Route
              path="/login"
              element={!background ? <Login /> : null}
            />
            <Route
              path="/register"
              element={!background ? <Register /> : null}
            />

            {/* Home / Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            

{/* Protected Route for PostsPage */}
<Route
  path="/create-posts"
  element={
    <ProtectedRoute>
      <PostsPage />
    </ProtectedRoute>
  }
/>

            <Route path="/home" element={<Home />} />

            {/* Articles */}
            <Route path="/all-articles" element={<ArticlePage />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />

            {/* Blogs */}
            <Route path="/all-blogs" element={<BlogPage />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />

            {/* Forum */}
            <Route path="/all-forum" element={<ForumPage />} />
            <Route path="/forum/:id" element={<ForumDetail />} />

            {/* Other pages */}
            <Route path="/form" element={<Form />} />
            <Route path="/profile" element={<Profile />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>

          {/* Modal overlay */}
          {background && (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          )}
        </Suspense>
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
