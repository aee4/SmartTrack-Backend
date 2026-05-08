const express = require("express");
const {
  createSession,
  startSession,
  stopSession,
  getSession,
  getMySessions,
} = require("../controllers/sessionController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();
const lecturerOnly = [verifyToken, requireRole("lecturer")];

router.post("/", lecturerOnly, createSession);
router.patch("/:id/start", lecturerOnly, startSession);
router.patch("/:id/stop", lecturerOnly, stopSession);
router.get("/my", lecturerOnly, getMySessions);
router.get("/:id", lecturerOnly, getSession);

module.exports = router;
