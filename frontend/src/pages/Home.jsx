import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../store/auth";
import { MealAvailability } from "../components/MealAvailability";

const defaultTodayMenu = {
  day: "",
  breakfast: "Poha, Bread Butter, Tea",
  lunch: "Dal, Rice, Chapati, Sabji",
  dinner: "Paneer Sabji, Chapati, Rice, Salad",
};

const menuItems = (value) => {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const Home = () => {
  const [todayMenu, setTodayMenu] = useState(defaultTodayMenu);
  const { user } = useAuth();

  useEffect(() => {
    const getLatestMenu = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.latestMenuNotification);
        const data = await response.json();

        if (response.ok && data.data) {
          setTodayMenu(data.data);
        }
      } catch (error) {
        console.log("latest menu fetch error", error);
      }
    };

    getLatestMenu();
    const intervalId = setInterval(getLatestMenu, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">Your daily hostel companion</span>
            <h1>Welcome back, <span>{user?.username || "Student"}</span></h1>
            <p>Everything you need for a smoother hostel day, from today&apos;s meals to essential services.</p>
            <div className="hero-meta">
              <div><strong>3</strong><span>Meals today</span></div>
              <div><strong>7</strong><span>Day meal plan</span></div>
              <div><strong>24/7</strong><span>Portal access</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-plate"><span>Today&apos;s<br />menu</span></div>
            <span className="hero-leaf hero-leaf--one" />
            <span className="hero-leaf hero-leaf--two" />
          </div>
        </div>
      </section>

      <MealAvailability />

      {/* meal menu */}
      <section className="meal-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Freshly planned</span><h2>Today&apos;s Meal Menu</h2></div>
            {todayMenu.day && <span className="day-pill">{todayMenu.day}</span>}
          </div>

          <div className="meal-grid">

            <div className="meal-card meal-card--breakfast">
              <span className="meal-icon">☀</span><h3>Breakfast</h3>
              <ul>
                {menuItems(todayMenu.breakfast).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="meal-card meal-card--lunch">
              <span className="meal-icon">◒</span><h3>Lunch</h3>
              <ul>
                {menuItems(todayMenu.lunch).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="meal-card meal-card--dinner">
              <span className="meal-icon">☾</span><h3>Dinner</h3>
              <ul>
                {menuItems(todayMenu.dinner).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* weekly menu */}
      <section className="weekly-menu">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Plan ahead</span><h2>Weekly Meal Plan</h2></div></div>

          <div className="table-shell"><table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Monday</td>
                <td>Poha</td>
                <td>Dal Rice</td>
                <td>Paneer</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>Upma</td>
                <td>Rajma Rice</td>
                <td>Mix Veg</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>Paratha</td>
                <td>Chole Rice</td>
                <td>Dal Roti</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>Idli Sambhar</td>
                <td>Kadhi Rice</td>
                <td>Aloo Gobi</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>Aloo Paratha</td>
                <td>Veg Pulao</td>
                <td>Dal Makhani</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>Sandwich</td>
                <td>Chana Rice</td>
                <td>Veg Biryani</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>Dosa</td>
                <td>Special Thali</td>
                <td>Paneer Butter Masala</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </section>
    </>
  );
};
