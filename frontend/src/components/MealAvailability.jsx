import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../store/auth";
import { apiRequest } from "../utils/api-client";

// Get tomorrow date in YYYY-MM-DD format.
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA");
};

// Extract saved status from API response.
const getStatusFromResponse = (result) => {
  return result.ok ? result.data?.data?.status || "" : "";
};

// One button for coming / not-coming.
const StatusButton = ({ label, value, status, isSaving, onClick }) => (
  <button
    className={status === value ? `selected ${value === "not-coming" ? "danger" : ""}` : ""}
    disabled={isSaving}
    onClick={() => onClick(value)}
  >
    {label}
  </button>
);

export const MealAvailability = () => {
  const [date, setDate] = useState(tomorrow());
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { authorizationToken } = useAuth();

  // Load saved availability for selected date.
  const loadStatus = useCallback(async () => {
    try {
      const result = await apiRequest(API_ENDPOINTS.mealAttendance(date), {
        method: "GET",
        token: authorizationToken,
      });
      setStatus(getStatusFromResponse(result));
    } catch {
      setStatus("");
    }
  }, [authorizationToken, date]);

  // Reload status when selected date changes.
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Save selected availability.
  const updateStatus = async (nextStatus) => {
    setIsSaving(true);

    try {
      const result = await apiRequest(API_ENDPOINTS.mealAttendance(date), {
        method: "PUT",
        token: authorizationToken,
        body: { date, status: nextStatus },
      });

      if (!result.ok) {
        toast.error(result.message || "Unable to update meal availability.");
        return;
      }

      setStatus(nextStatus);
      toast.success("Meal availability updated.");
    } catch {
      toast.error("Unable to connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="availability-section">
      <div className="container availability-card">
        <div>
          <span className="eyebrow">Meal confirmation</span>
          <h2>Will you attend the hostel meals?</h2>
          <p>Confirm your availability so the kitchen can prepare the correct quantity.</p>
        </div>

        <div className="availability-actions">
          <label>
            <span>Meal Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <div>
            <StatusButton
              label="I Will Attend"
              value="coming"
              status={status}
              isSaving={isSaving}
              onClick={updateStatus}
            />
            <StatusButton
              label="I Will Not Attend"
              value="not-coming"
              status={status}
              isSaving={isSaving}
              onClick={updateStatus}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
