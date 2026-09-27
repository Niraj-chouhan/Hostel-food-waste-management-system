import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";

export const CookLayout = () => {
  const { user } = useAuth();

  return (
    <div className="cook-workspace">
      <aside className="cook-sidebar">
        <div className="cook-brand">
          <span>HH</span>
          <div>
            <strong>Hostel Hub</strong>
            <small>Kitchen Operations</small>
          </div>
        </div>

        <div className="cook-profile">
          <span>{(user?.username || "C").charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user?.username || "Hostel Cook"}</strong>
            <small>Kitchen Administrator</small>
          </div>
        </div>

        <nav aria-label="Cook workspace navigation">
          <NavLink to="/cook/records">Attendance Records</NavLink>
          <NavLink to="/cook/menu">Meal Menu</NavLink>
          <NavLink to="/cook/calendar">Meal Calendar</NavLink>
        </nav>

        <NavLink className="cook-logout" to="/logout">Sign Out</NavLink>
      </aside>

      <main className="cook-content">
        <Outlet />
      </main>
    </div>
  );
};
