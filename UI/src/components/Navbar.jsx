import { Link, useLocation } from "react-router-dom";
import { ThemeSelector } from "../context/ThemeContext";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

import { FaCircleUser } from "react-icons/fa6";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          MyDrive
        </Link>
      </div>
      <ThemeSelector />
      {/* Middle: Nav Links */}
      <div className="hidden md:flex">
        {/* Right: Theme Switch */}

        <ul className="flex justify-center items-center gap-4 px-1 ml-2">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
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
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
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
            <li className="flex justify-center items-center h-full border-2 rounded-lg p-2 gap-2">
              <FaCircleUser className="text-xl text-neutral" />
              <span>{user?.name}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
