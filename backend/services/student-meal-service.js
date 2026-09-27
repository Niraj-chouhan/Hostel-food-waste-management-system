const MealAttendance = require("../models/meal-attendance-model");
const Leave = require("../models/leave-model");
const Feedback = require("../models/feedback-model");
const { getDatesBetween } = require("./meal-planning-service");

// Save one student's meal availability for one date.
const saveAvailability = (studentId, date, status) => {
  return MealAttendance.findOneAndUpdate(
    { student: studentId, date },
    { status },
    { new: true, upsert: true, runValidators: true }
  );
};

// Read one student's saved availability for one date.
const findAvailability = (studentId, date) => {
  return MealAttendance.findOne({ student: studentId, date });
};

// Create a leave record for the student.
const createLeave = (studentId, leaveData) => {
  return Leave.create({
    student: studentId,
    fromDate: leaveData.fromDate,
    toDate: leaveData.toDate,
    reason: leaveData.reason,
  });
};

// Mark every leave date as not-coming for meal planning.
const markLeaveDatesAsNotComing = async (studentId, fromDate, toDate) => {
  const dates = getDatesBetween(fromDate, toDate);

  await MealAttendance.bulkWrite(
    dates.map((date) => ({
      updateOne: {
        filter: { student: studentId, date },
        update: { $set: { status: "not-coming" } },
        upsert: true,
      },
    }))
  );

  return dates;
};

// Get all leave records of the logged-in student.
const getStudentLeaves = (studentId) => {
  return Leave.find({ student: studentId }).sort({ fromDate: -1 });
};

// Save rating and comment for a meal.
const saveFeedback = ({ studentId, date, meal, rating, comment }) => {
  return Feedback.findOneAndUpdate(
    { student: studentId, date, meal },
    { rating, comment },
    { new: true, upsert: true, runValidators: true }
  );
};

// Find all not-coming dates in a billing period.
const getNotComingDates = async (studentId, fromDate, toDate) => {
  const dates = getDatesBetween(fromDate, toDate);
  const records = await MealAttendance.find({
    student: studentId,
    date: { $in: dates },
  }).lean();

  const statusByDate = new Map(records.map((record) => [record.date, record.status]));
  return dates.filter((date) => statusByDate.get(date) === "not-coming");
};

// Calculate estimated fee credit from not-coming dates.
const calculateBillingCredit = async ({ studentId, fromDate, toDate, dailyRate }) => {
  const notComingDates = await getNotComingDates(studentId, fromDate, toDate);

  return {
    from: fromDate,
    to: toDate,
    dailyRate,
    notComingDays: notComingDates.length,
    notComingDates,
    estimatedCredit: Number((notComingDates.length * dailyRate).toFixed(2)),
    note: "Only explicitly marked not-coming days are credited.",
  };
};

module.exports = {
  calculateBillingCredit,
  createLeave,
  findAvailability,
  getStudentLeaves,
  markLeaveDatesAsNotComing,
  saveAvailability,
  saveFeedback,
};
