const {
  getAttendanceAnalytics,
  getCookMealPlan,
  getWeeklyMenu,
  isValidDate,
} = require("../services/meal-planning-service");

const getAttendance = async (req, res, next) => {
  try {
    // Read selected date from query params.
    const date = req.query.date;

    // Stop request if date is not valid.
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "A valid date is required." });
    }

    // Get attendance, menu and ingredient quantity for cook.
    const mealPlan = await getCookMealPlan(date);
    return res.status(200).json(mealPlan);
  } catch (error) {
    next(error);
  }
};

const getMenu = async (req, res, next) => {
  try {
    // Get complete weekly menu.
    const menu = await getWeeklyMenu();
    return res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    // Read analytics date range from query params.
    const toDate = req.query.to;
    const fromDate = req.query.from;

    // Stop request if either date is invalid.
    if (!isValidDate(fromDate) || !isValidDate(toDate)) {
      return res.status(400).json({ message: "Valid from and to dates are required." });
    }

    // Get historical attendance summary.
    const analytics = await getAttendanceAnalytics(fromDate, toDate);
    return res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendance,
  getAnalytics,
  getMenu,
};
