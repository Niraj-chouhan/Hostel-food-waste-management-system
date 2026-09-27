import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/about";
import { Contact } from "./pages/contact";
import { Service } from "./pages/service";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Navbar } from "./components/Navbar";
import { Error } from "./pages/Error";
import { Logout } from "./pages/logout";
import { AdminLayout } from "./components/layout/Admin-Layout";
import { AdminUsers } from "./pages/Admin-Users";
import { AdminContacts } from "./pages/Admin-Contacts";
import { AdminService } from "./pages/Admin-Service";
import { AdminUpdate } from "./pages/Admin-Update";
import { AddMenu } from "./pages/Admin-menu";
import { RequireAuth } from "./components/RequireAuth";
import { AdminDashboard } from "./pages/Admin-Dashboard";
import { CookLayout } from "./components/layout/Cook-Layout";
import { CookCalendar } from "./pages/Cook-Calendar";
import { CookRecords } from "./pages/Cook-Records";
import { CookMenu } from "./pages/Cook-Menu";
import { useAuth } from "./store/auth";
import { getDashboardPath } from "./utils/roles";

const LoginRoute = () => {
  const { isLoggedIn, user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div className="route-loader"><span className="route-loader__spinner" /></div>;
  }

  if (isLoggedIn && user) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return <Login />;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/logout" element={<Logout />} />
          <Route element={<RequireAuth role="student" />}>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/service" element={<Service />}/>
          </Route>
          <Route element={<RequireAuth adminOnly />}>
            <Route path="/admin" element={<AdminLayout/>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers/>}/>
              <Route path="users/:id/edit" element={<AdminUpdate/>}/>
              <Route path="contacts" element={<AdminContacts/>}/>
              <Route path="services" element={<AdminService/>}/>
              <Route path="menu" element={<AddMenu/>}/>
              <Route path="contact" element={<Navigate to="/admin/contacts" replace />} />
              <Route path="service" element={<Navigate to="/admin/services" replace />} />
            </Route>
          </Route>
          <Route element={<RequireAuth role="cook" />}>
            <Route path="/cook" element={<CookLayout />}>
              <Route index element={<Navigate to="/cook/calendar" replace />} />
              <Route path="records" element={<CookRecords />} />
              <Route path="menu" element={<CookMenu />} />
              <Route path="calendar" element={<CookCalendar />} />
            </Route>
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );

};

export default App;
