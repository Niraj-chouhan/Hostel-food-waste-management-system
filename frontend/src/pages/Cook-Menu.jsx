import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS, parseListResponse } from "../config/api";
import { useAuth } from "../store/auth";

export const CookMenu = () => {
  const [menu, setMenu] = useState([]);
  const [message, setMessage] = useState("Loading weekly menu...");
  const { authorizationToken } = useAuth();

  const loadMenu = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.cookMenu, {
        headers: { Authorization: authorizationToken },
      });
      const result = await response.json();
      const items = parseListResponse(result);
      setMenu(items);
      setMessage(response.ok ? "" : (result.message || "Unable to load menu."));
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }, [authorizationToken]);

  useEffect(() => {
    const fetchMenu = async () => {
      await loadMenu();
    };

    fetchMenu();
  }, [loadMenu]);

  return (
    <section className="cook-page">
      <div className="cook-page-heading">
        <div>
          <span className="eyebrow">Kitchen schedule</span>
          <h1>Weekly Meal Menu</h1>
          <p>Review the approved breakfast, lunch and dinner schedule for the week.</p>
        </div>
      </div>
      {message && <p className="empty-state">{message}</p>}
      <div className="cook-menu-grid">
        {menu.map((item) => (
          <article key={item.day}>
            <h2>{item.day}</h2>
            <div><span>Breakfast</span><p>{item.breakfast}</p></div>
            <div><span>Lunch</span><p>{item.lunch}</p></div>
            <div><span>Dinner</span><p>{item.dinner}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
};
