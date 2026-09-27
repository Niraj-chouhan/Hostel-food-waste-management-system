import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";
import { getUserRole } from "../utils/roles";

export const Navbar = () => {
  const{isLoggedIn, user} = useAuth();
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  if (location.pathname.startsWith("/cook")) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo-brand">
          <NavLink className="site-brand" to="/">
            <span>H</span>
            <strong>Hostel Hub</strong>
          </NavLink>

          <ul>
            <li>
              <NavLink to="/">Overview</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/service">Service</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            {user?.isAdmin && (
              <li>
                <NavLink to="/admin">Admin</NavLink>
              </li>
            )}
            {getUserRole(user) === "cook" && (
              <li>
                <NavLink to="/cook/calendar">Cook Workspace</NavLink>
              </li>
            )}
            {isLoggedIn ? (    <li>
              <NavLink to="/logout">Logout</NavLink>

            </li>
            ):(
            <>
                 <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            </>
          )}
          </ul>
        </div>
      </div>
    </header>
  );
};
