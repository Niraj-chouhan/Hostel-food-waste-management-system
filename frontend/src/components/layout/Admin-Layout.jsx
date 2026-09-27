import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../../store/auth";

export const AdminLayout = () => {
    const { user } = useAuth();

    return (
        <div className="admin-workspace">
            <header className="admin-nav">
                <div className="container">
                    <div className="admin-nav__title"><span>Admin workspace</span><strong>{user?.username || "Administrator"}</strong></div>
                    <nav>
                        <ul>
                            <li><NavLink end to="/admin">Overview</NavLink>
                            </li>
                            <li><NavLink to="/admin/users">Users</NavLink>
                            </li>
                            <li><NavLink to="/admin/contacts">Contacts</NavLink>
                            </li>
                            <li><NavLink to="/admin/services">Services</NavLink>
                            </li>
                            <li><NavLink to="/admin/menu">Menu</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
    
        <Outlet/>
    </div>
    );
};
