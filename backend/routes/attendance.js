const express = require("express");
const {
  submitAttendance,
  getSessionAttendance,
  getMyAttendance,
  getAnalytics,
  exportAttendance,
} = require("../controllers/attendanceController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();
const studentOnly = [verifyToken, requireRole("student")];
const lecturerOnly = [verifyToken, requireRole("lecturer")];

router.post("/submit", studentOnly, submitAttendance);
router.get("/session/:id", lecturerOnly, getSessionAttendance);
router.get("/student/me", studentOnly, getMyAttendance);
router.get("/analytics/:sessionId", lecturerOnly, getAnalytics);
router.get("/export/:sessionId", lecturerOnly, exportAttendance);

module.exports = router;
