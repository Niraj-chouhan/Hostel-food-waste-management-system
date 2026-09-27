const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const attendanceController = require("../controllers/attendance-controller");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, attendanceController.getMyAvailability)
  .put(authMiddleware, attendanceController.submitAvailability);

router
  .route("/leaves")
  .get(authMiddleware, attendanceController.getMyLeaves)
  .post(authMiddleware, attendanceController.submitLeave);

router
  .route("/feedback")
  .post(authMiddleware, attendanceController.submitFeedback);

router
  .route("/billing-adjustment")
  .get(authMiddleware, attendanceController.getBillingAdjustment);

module.exports = router;
