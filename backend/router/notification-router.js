const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const { isValidDate } = require("../services/meal-planning-service");
const {
  createAvailabilityReminders,
  createMenuNotification,
  getLatestMenuNotification,
  getUserNotifications,
  hasMenuDetails,
} = require("../services/notification-service");

const router = express.Router();

// Admin sends latest menu notification.
router.post("/send-menu", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { userId, day, breakfast, lunch, dinner } = req.body;

    if (!hasMenuDetails({ day, breakfast, lunch, dinner })) {
      return res.status(400).json({ message: "Menu details are required" });
    }

    const notification = await createMenuNotification({
      userId,
      day,
      breakfast,
      lunch,
      dinner,
    });

    return res.status(200).json({
      message: "Menu notification sent successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
});

// Admin sends availability reminder for a date.
router.post("/remind-availability", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { date } = req.body;

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "A valid date is required." });
    }

    const reminderResult = await createAvailabilityReminders(date);

    return res.status(200).json({
      message: "Availability reminders generated.",
      date: reminderResult.date,
      pendingStudents: reminderResult.pendingStudents,
      data: reminderResult.notifications,
    });
  } catch (error) {
    next(error);
  }
});

// Student home reads latest published menu.
router.get("/latest-menu", async (req, res, next) => {
  try {
    const latestMenuNotification = await getLatestMenuNotification();

    return res.status(200).json({
      data: latestMenuNotification,
    });
  } catch (error) {
    next(error);
  }
});

// Logged-in user reads their notifications.
router.get("/my", authMiddleware, async (req, res, next) => {
  try {
    const notifications = await getUserNotifications(req.userID);

    return res.status(200).json({ data: notifications });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
