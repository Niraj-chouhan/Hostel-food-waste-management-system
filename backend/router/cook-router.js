const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const cookMiddleware = require("../middlewares/cook-middleware");
const cookController = require("../controllers/cook-controller");

const router = express.Router();

router.get(
  "/attendance",
  authMiddleware,
  cookMiddleware,
  cookController.getAttendance
);
router.get(
  "/analytics",
  authMiddleware,
  cookMiddleware,
  cookController.getAnalytics
);
router.get("/menu", authMiddleware, cookMiddleware, cookController.getMenu);

module.exports = router;
