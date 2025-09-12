import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FaUserCircle } from "react-icons/fa";
import Button from "../Buttons/Button";

const AuthMenu = ({ user, mobile = false, closeMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false); // New state for create modal
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    setMenuOpen(false);
    if (closeMenu) closeMenu();
  };

  // Close menu or create modal on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setCreateOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // If user is not logged in
  if (!user) {
    return (
      <div
        className={`flex ${mobile ? "flex-col gap-2" : "gap-3"} items-center`}
      >
        <Link to="/login" state={{ background: location }} onClick={closeMenu}>
          <Button>Login</Button>
        </Link>
        <Link
          to="/register"
          state={{ background: location }}
          onClick={closeMenu}
        >
          <Button styles="bg-indigo-500 text-white hover:bg-indigo-600">
            Create +
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Desktop Avatar Icon */}
      {!mobile && (
        <div className="flex items-center gap-2">
          <Link to="/create-posts">
  <Button>Create</Button>
</Link>

          <FaUserCircle
            className="text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </div>
      )}

      {/* Dropdown Menu */}
      {menuOpen && !mobile && (
        <div className="absolute right-0 mt-2 w-30 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {mobile && (
        <div className="flex gap-3 mt-2 flex-col">
          <Button onClick={() => setCreateOpen((prev) => !prev)}>Create</Button>
          <Link to="/profile" onClick={closeMenu}>
            <Button>Profile</Button>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}

      {/* Create Modal */}
     
     
     
     
    </div>
  );
};

export default AuthMenu;
