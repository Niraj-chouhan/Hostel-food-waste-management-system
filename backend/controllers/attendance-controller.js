const { isValidDate } = require("../services/meal-planning-service");
const {
  calculateBillingCredit,
  createLeave,
  findAvailability,
  getStudentLeaves,
  markLeaveDatesAsNotComing,
  saveAvailability,
  saveFeedback,
} = require("../services/student-meal-service");

// Check if selected status is allowed.
const isValidMealStatus = (status) => ["coming", "not-coming"].includes(status);

// Check if date range is valid.
const isValidDateRange = (fromDate, toDate) => {
  return isValidDate(fromDate) && isValidDate(toDate) && fromDate <= toDate;
};

const submitAvailability = async (req, res, next) => {
  try {
    // Read date and selected availability from request body.
    const { date, status } = req.body;

    // Stop request if date is not in YYYY-MM-DD format.
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "A valid date is required." });
    }

    // Stop request if status is not coming or not-coming.
    if (!isValidMealStatus(status)) {
      return res.status(400).json({ message: "Select a valid availability status." });
    }

    // Save availability for the logged-in student.
    const record = await saveAvailability(req.userID, date, status);

    return res.status(200).json({
      message: "Meal availability updated successfully.",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const getMyAvailability = async (req, res, next) => {
  try {
    // Read date from query params.
    const date = req.query.date;

    // Stop request if date is not valid.
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "A valid date is required." });
    }

    // Find saved availability for this student and date.
    const record = await findAvailability(req.userID, date);
    return res.status(200).json({ data: record });
  } catch (error) {
    next(error);
  }
};

const submitLeave = async (req, res, next) => {
  try {
    // Read leave range and reason from request body.
    const { fromDate, toDate, reason } = req.body;

    // Stop request if leave range is wrong.
    if (!isValidDateRange(fromDate, toDate)) {
      return res.status(400).json({ message: "A valid leave date range is required." });
    }

    // Save leave record.
    const leave = await createLeave(req.userID, { fromDate, toDate, reason });

    // Auto-mark every leave day as not-coming.
    const updatedDates = await markLeaveDatesAsNotComing(req.userID, fromDate, toDate);

    return res.status(201).json({
      message: "Leave saved and meal availability marked as not-coming.",
      data: leave,
      updatedDates,
    });
  } catch (error) {
    next(error);
  }
};

const getMyLeaves = async (req, res, next) => {
  try {
    // Get all leave records of the logged-in student.
    const leaves = await getStudentLeaves(req.userID);
    return res.status(200).json({ data: leaves });
  } catch (error) {
    next(error);
  }
};

const submitFeedback = async (req, res, next) => {
  try {
    // Read feedback details from request body.
    const { date, meal, rating, comment } = req.body;

    // Stop request if feedback date is invalid.
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "A valid date is required." });
    }

    // Save or update feedback for the selected meal.
    const feedback = await saveFeedback({
      studentId: req.userID,
      date,
      meal,
      rating,
      comment,
    });

    return res.status(200).json({
      message: "Meal feedback saved.",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

const getBillingAdjustment = async (req, res, next) => {
  try {
    // Read billing period and per-day fee from query params.
    const { from, to } = req.query;
    const dailyRate = Number(req.query.dailyRate || 0);

    // Stop request if billing period is invalid.
    if (!isValidDateRange(from, to)) {
      return res.status(400).json({ message: "A valid billing date range is required." });
    }

    // Stop request if fee value is invalid.
    if (Number.isNaN(dailyRate) || dailyRate < 0) {
      return res.status(400).json({ message: "Daily rate must be a positive number." });
    }

    // Calculate credit for explicitly marked not-coming days.
    const billing = await calculateBillingCredit({
      studentId: req.userID,
      fromDate: from,
      toDate: to,
      dailyRate,
    });

    return res.status(200).json(billing);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAvailability,
  getMyAvailability,
  submitLeave,
  getMyLeaves,
  submitFeedback,
  getBillingAdjustment,
};
