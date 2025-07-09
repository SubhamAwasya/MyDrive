import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeSelector } from "../context/ThemeContext";
import { useUser } from "../context/UserContext.jsx";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <div className="navbar top-0 z-10 bg-base-100 shadow">
      {/* Left: Brand */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          MyDrive
        </Link>
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Middle: Theme Switch */}
      <div className="hidden md:block ml-auto mr-4">
        <ThemeSelector />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center">
        <ul className="flex items-center gap-4 px-1">
          {!user && (
            <>
              <li>
                <Link
                  to="/login"
                  className={location.pathname === "/login" ? "active" : ""}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={location.pathname === "/register" ? "active" : ""}
                >
                  Register
                </Link>
              </li>
            </>
          )}
          {user && (
            <li>
              <button
                onClick={handleLogout}
                className={location.pathname === "/logout" ? "active" : ""}
              >
                Logout
              </button>
            </li>
          )}
          <li>
            <Link to="/aboutMe">About Me</Link>
          </li>
          {user && (
            <li className="flex items-center border-2 rounded-lg px-2 py-1 gap-2">
              <FaCircleUser className="text-xl text-neutral" />
              <span>{user?.name}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="w-full md:hidden absolute top-16 left-0 bg-base-100 shadow-md z-50 px-4 py-2">
          <ul className="flex flex-col gap-3">
            <ThemeSelector />
            {!user && (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
            <li>
              <Link to="/aboutMe" onClick={() => setMenuOpen(false)}>
                About Me
              </Link>
            </li>
            {user && (
              <li className="flex items-center border-2 rounded-lg px-2 py-1 gap-2">
                <FaCircleUser className="text-xl text-neutral" />
                <span>{user?.name}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
