import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../store/auth";
import { apiRequest, toList } from "../utils/api-client";

// Get tomorrow date in YYYY-MM-DD format.
const getTomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA");
};

// Create editable draft from one menu card.
const createMenuDraft = (menu) => ({
  breakfast: menu.breakfast,
  lunch: menu.lunch,
  dinner: menu.dinner,
});

// Render text or input for one meal field.
const MealField = ({ field, label, value, isEditing, draftMenu, onChange }) => (
  <div className="menu-item">
    <span>{label}</span>
    {isEditing ? (
      <input
        value={draftMenu[field] || ""}
        onChange={(event) => onChange(field, event.target.value)}
      />
    ) : (
      <p>{value}</p>
    )}
  </div>
);

export const AddMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [editingDay, setEditingDay] = useState("");
  const [draftMenu, setDraftMenu] = useState({});
  const [message, setMessage] = useState("Loading menu...");
  const { authorizationToken } = useAuth();

  // Load weekly menu from backend.
  const getMenuData = useCallback(async () => {
    if (!authorizationToken) return;

    try {
      const result = await apiRequest(API_ENDPOINTS.adminMenu, {
        method: "GET",
        token: authorizationToken,
      });

      if (!result.ok) {
        setMenuData([]);
        setMessage(result.message || "Unable to load menu.");
        return;
      }

      const menu = toList(result.data);
      setMenuData(menu);
      setMessage(menu.length === 0 ? "No menu available." : "");
    } catch {
      setMessage("Unable to load menu.");
    }
  }, [authorizationToken]);

  // Fetch menu when page opens.
  useEffect(() => {
    getMenuData();
  }, [getMenuData]);

  // Send selected day menu to students.
  const sendMenuNotification = async (menu) => {
    try {
      const result = await apiRequest(API_ENDPOINTS.sendMenuNotification, {
        method: "POST",
        token: authorizationToken,
        body: { userId: "all", ...menu },
      });

      if (!result.ok) {
        toast.error(result.message || "Failed to send notification");
        return;
      }

      toast.success(`${menu.day} menu sent successfully`);
    } catch {
      toast.error("Server error");
    }
  };

  // Start editing selected day.
  const startEdit = (menu) => {
    setEditingDay(menu.day);
    setDraftMenu(createMenuDraft(menu));
  };

  // Update one field in edit form.
  const updateDraft = (field, value) => {
    setDraftMenu((current) => ({ ...current, [field]: value }));
  };

  // Save edited menu for one day.
  const saveMenu = async (day) => {
    try {
      const result = await apiRequest(API_ENDPOINTS.adminMenuDay(day), {
        method: "PATCH",
        token: authorizationToken,
        body: draftMenu,
      });

      if (!result.ok) {
        toast.error(result.message || "Unable to update menu.");
        return;
      }

      toast.success("Menu updated.");
      setEditingDay("");
      await getMenuData();
    } catch {
      toast.error("Server error");
    }
  };

  // Remind students to fill tomorrow availability.
  const sendAvailabilityReminder = async () => {
    try {
      const result = await apiRequest(API_ENDPOINTS.sendAvailabilityReminder, {
        method: "POST",
        token: authorizationToken,
        body: { date: getTomorrowDate() },
      });

      if (!result.ok) {
        toast.error(result.message || "Unable to send reminder.");
        return;
      }

      toast.success(`Reminder queued for ${result.data.pendingStudents} students`);
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <section className="menu-section">
      <div className="container">
        <div className="admin-page-heading">
          <div>
            <span className="eyebrow">Meal management</span>
            <h1>Weekly hostel menu</h1>
            <p>Review meals and publish the latest menu to residents.</p>
          </div>
          <button className="download-button" onClick={sendAvailabilityReminder}>
            Send Tomorrow Reminder
          </button>
        </div>
      </div>

      <div className="menu-scroll">
        {message && <p className="empty-state">{message}</p>}

        {menuData.map((menu) => {
          const isEditing = editingDay === menu.day;

          return (
            <div className="menu-card" key={menu.day}>
              <h2>{menu.day}</h2>

              <MealField
                field="breakfast"
                label="Breakfast"
                value={menu.breakfast}
                isEditing={isEditing}
                draftMenu={draftMenu}
                onChange={updateDraft}
              />
              <MealField
                field="lunch"
                label="Lunch"
                value={menu.lunch}
                isEditing={isEditing}
                draftMenu={draftMenu}
                onChange={updateDraft}
              />
              <MealField
                field="dinner"
                label="Dinner"
                value={menu.dinner}
                isEditing={isEditing}
                draftMenu={draftMenu}
                onChange={updateDraft}
              />

              <div className="menu-buttons">
                <button className="btn" onClick={() => sendMenuNotification(menu)}>
                  Publish
                </button>
                <button
                  className="edit-btn"
                  onClick={() => (isEditing ? saveMenu(menu.day) : startEdit(menu))}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
