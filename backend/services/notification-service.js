const User = require("../models/user-model");
const MealAttendance = require("../models/meal-attendance-model");
const Notification = require("../models/notification-model");

// Check if menu notification has all meal details.
const hasMenuDetails = ({ day, breakfast, lunch, dinner }) => {
  return Boolean(day && breakfast && lunch && dinner);
};

// Convert "all" target into null because null means broadcast.
const getNotificationUser = (userId) => {
  return userId && userId !== "all" ? userId : null;
};

// Create menu notification in database.
const createMenuNotification = (menu) => {
  return Notification.create({
    type: "menu",
    user: getNotificationUser(menu.userId),
    title: `${menu.day} menu published`,
    message: `Breakfast: ${menu.breakfast}, Lunch: ${menu.lunch}, Dinner: ${menu.dinner}`,
    payload: { ...menu, userId: menu.userId || "all" },
  });
};

// Get all non-admin and non-cook student ids.
const getStudentIds = async () => {
  return User.find({ isAdmin: false, role: { $ne: "cook" } }, { _id: 1 }).lean();
};

// Get students who have already submitted availability.
const getSubmittedStudentIds = async (date, students) => {
  const submitted = await MealAttendance.find({
    date,
    student: { $in: students.map((student) => student._id) },
  }).distinct("student");

  return new Set(submitted.map((id) => id.toString()));
};

// Find students who still need reminder.
const getPendingStudents = async (date) => {
  const students = await getStudentIds();
  const submittedIds = await getSubmittedStudentIds(date, students);

  return students.filter((student) => !submittedIds.has(student._id.toString()));
};

// Create reminder payload for one student.
const buildReminder = (student, date) => ({
  type: "availability-reminder",
  user: student._id,
  title: "Meal availability pending",
  message: `Please submit meal availability for ${date}. Default fallback is not-coming if no response is submitted.`,
  payload: { date, fallbackStatus: "not-coming" },
});

// Create reminders for students who did not submit availability.
const createAvailabilityReminders = async (date) => {
  const pendingStudents = await getPendingStudents(date);
  const notifications = await Notification.insertMany(
    pendingStudents.map((student) => buildReminder(student, date))
  );

  return {
    date,
    pendingStudents: pendingStudents.length,
    notifications,
  };
};

// Get latest menu notification.
const getLatestMenuNotification = () => {
  return Notification.findOne({ type: "menu" }).sort({ createdAt: -1 }).lean();
};

// Get notifications for one user plus broadcast notifications.
const getUserNotifications = (userId) => {
  return Notification.find({
    $or: [{ user: userId }, { user: null }],
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();
};

module.exports = {
  createAvailabilityReminders,
  createMenuNotification,
  getLatestMenuNotification,
  getUserNotifications,
  hasMenuDetails,
};
