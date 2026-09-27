import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../store/auth";
import { apiRequest } from "../utils/api-client";

// Get today date in YYYY-MM-DD format.
const today = () => new Date().toLocaleDateString("en-CA");

// Get past date in YYYY-MM-DD format.
const dateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString("en-CA");
};

// Escape one CSV cell.
const toCsvCell = (value) => `"${String(value || "").replaceAll('"', '""')}"`;

// Convert student list into CSV text.
const buildStudentCsv = (students, label) => {
  const rows = [
    ["Student Name", "Email Address", "Phone Number", "Meal Status"],
    ...students.map((student) => [student.username, student.email, student.phone, label]),
  ];

  return rows.map((row) => row.map(toCsvCell).join(",")).join("\n");
};

// Download student list as CSV.
const downloadCsv = (students, date, label) => {
  const csv = buildStudentCsv(students, label);
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = `${label.toLowerCase().replaceAll(" ", "-")}-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Initial shape keeps UI safe before API data loads.
const emptyAttendance = {
  summary: {
    totalStudents: 0,
    comingStudents: 0,
    notComingStudents: 0,
    missingResponses: 0,
  },
  coming: [],
  notComing: [],
  shoppingList: { meals: [], totals: [], missingRecipes: [] },
};

// Show top count cards.
const AttendanceStats = ({ summary }) => (
  <div className="cook-stat-grid">
    <article>
      <span>Total Registered Students</span>
      <strong>{summary.totalStudents}</strong>
      <small>Eligible residents</small>
    </article>
    <article className="stat-success">
      <span>Expected for Meals</span>
      <strong>{summary.comingStudents}</strong>
      <small>Confirmed attendance</small>
    </article>
    <article className="stat-muted">
      <span>Not Expected</span>
      <strong>{summary.notComingStudents}</strong>
      <small>Unavailable or no response</small>
    </article>
    <article>
      <span>Missing Responses</span>
      <strong>{summary.missingResponses}</strong>
      <small>Fallback: not-coming</small>
    </article>
  </div>
);

// Show ingredient quantity list.
const IngredientList = ({ shoppingList }) => (
  <div className="ingredient-grid">
    {shoppingList.totals.map((item) => (
      <div className="ingredient-row" key={`${item.name}-${item.unit}`}>
        <strong>{item.name}</strong>
        <span>
          {item.requiredQuantity} {item.unit}
        </span>
      </div>
    ))}
    {!shoppingList.totals.length && (
      <p className="empty-state">No ingredients calculated yet.</p>
    )}
  </div>
);

// Show cooking quantity panel.
const CookingQuantityPanel = ({ data }) => (
  <section className="meal-plan-panel">
    <div className="panel-heading">
      <div>
        <h2>Cooking Quantity</h2>
        <p>
          {data.menu
            ? `${data.menu.day}: ${data.menu.breakfast}, ${data.menu.lunch}, ${data.menu.dinner}`
            : "No menu found for selected date."}
        </p>
      </div>
      <span>{data.summary.comingStudents} people</span>
    </div>

    <IngredientList shoppingList={data.shoppingList} />

    {data.shoppingList.missingRecipes.length > 0 && (
      <p className="recipe-warning">
        Recipe missing for: {data.shoppingList.missingRecipes.join(", ")}
      </p>
    )}
  </section>
);

// Show short analytics panel.
const AnalyticsPanel = ({ analytics }) => (
  <section className="meal-plan-panel">
    <div className="panel-heading">
      <div>
        <h2>7-Day Analytics</h2>
        <p>Attendance pattern from recent records.</p>
      </div>
    </div>
    <div className="analytics-strip">
      <div>
        <span>Avg Coming</span>
        <strong>{analytics?.averageComing ?? "-"}</strong>
      </div>
      <div>
        <span>Missing</span>
        <strong>{analytics?.missingResponses ?? "-"}</strong>
      </div>
      <div>
        <span>Submitted</span>
        <strong>{analytics?.submittedResponses ?? "-"}</strong>
      </div>
    </div>
  </section>
);

// Show coming / not-coming tabs.
const AttendanceTabs = ({ activeList, data, onChange }) => (
  <div className="attendance-tabs">
    <button className={activeList === "coming" ? "active" : ""} onClick={() => onChange("coming")}>
      Expected Students <span>{data.coming.length}</span>
    </button>
    <button
      className={activeList === "not-coming" ? "active" : ""}
      onClick={() => onChange("not-coming")}
    >
      Not Expected <span>{data.notComing.length}</span>
    </button>
  </div>
);

// Show student table for selected tab.
const StudentTable = ({ students, activeList }) => (
  <div className="cook-table-shell">
    <table>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Email Address</th>
          <th>Phone Number</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id}>
            <td>
              <strong>{student.username}</strong>
            </td>
            <td>{student.email}</td>
            <td>{student.phone}</td>
            <td>
              <span className={`attendance-status ${activeList}`}>
                {activeList === "coming" ? "Expected" : "Not Expected"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {!students.length && <p className="empty-state">No students are available in this category.</p>}
  </div>
);

export const CookAttendanceView = ({ title, description, eyebrow }) => {
  const [selectedDate, setSelectedDate] = useState(today());
  const [activeList, setActiveList] = useState("coming");
  const [data, setData] = useState(emptyAttendance);
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState("Loading attendance data...");
  const { authorizationToken } = useAuth();

  // Load attendance and cooking quantity for selected date.
  const loadAttendance = useCallback(async () => {
    try {
      setMessage("Loading attendance data...");
      const result = await apiRequest(API_ENDPOINTS.cookAttendance(selectedDate), {
        method: "GET",
        token: authorizationToken,
      });

      if (!result.ok) {
        setMessage(result.message || "Unable to load attendance data.");
        return;
      }

      setData(result.data);
      setMessage("");
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }, [authorizationToken, selectedDate]);

  // Load selected date data when date changes.
  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // Load recent analytics once for cook dashboard.
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await apiRequest(API_ENDPOINTS.cookAnalytics(dateDaysAgo(6), today()), {
          method: "GET",
          token: authorizationToken,
        });

        setAnalytics(result.ok ? result.data : null);
      } catch {
        setAnalytics(null);
      }
    };

    loadAnalytics();
  }, [authorizationToken]);

  const students = activeList === "coming" ? data.coming : data.notComing;
  const listLabel = activeList === "coming" ? "Attending Students" : "Not Attending Students";

  return (
    <section className="cook-page">
      <div className="cook-page-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <label className="date-control">
          <span>Selected Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
      </div>

      <AttendanceStats summary={data.summary} />

      <div className="meal-plan-grid">
        <CookingQuantityPanel data={data} />
        <AnalyticsPanel analytics={analytics} />
      </div>

      <div className="attendance-panel">
        <AttendanceTabs activeList={activeList} data={data} onChange={setActiveList} />

        <div className="attendance-list-heading">
          <div>
            <h2>{listLabel}</h2>
            <p>Meal availability for {selectedDate}</p>
          </div>
          <button
            className="download-button"
            disabled={!students.length}
            onClick={() => downloadCsv(students, selectedDate, listLabel)}
          >
            Download CSV
          </button>
        </div>

        {message ? (
          <p className="empty-state">{message}</p>
        ) : (
          <StudentTable students={students} activeList={activeList} />
        )}
      </div>
    </section>
  );
};
