const Attendance = require("../models/Attendance");
const Session = require("../models/Session");
const User = require("../models/User");
const { getDistanceMeters } = require("../utils/haversine");

const submitAttendance = async (req, res) => {
  try {
    const { sessionId, qrToken, deviceId, latitude, longitude } = req.body;
    const session = await Session.findById(sessionId);

    if (!session || session.qrToken !== qrToken) {
      return res.status(401).json({ message: "Invalid or expired QR code" });
    }

    if (!session.qrExpiry || session.qrExpiry <= Date.now()) {
      return res.status(401).json({ message: "QR code has expired" });
    }

    if (!session.activeStatus) {
      return res.status(403).json({ message: "Session is no longer active" });
    }

    const existingAttendance = await Attendance.findOne({
      sessionId,
      deviceId,
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "This device has already submitted attendance for this session",
      });
    }

    const distance = getDistanceMeters(
      latitude,
      longitude,
      session.latitude,
      session.longitude
    );

    if (distance > session.radius) {
      return res
        .status(403)
        .json({ message: "You are too far from the classroom" });
    }

    const status =
      Date.now() - session.startTime <= 10 * 60 * 1000 ? "present" : "late";

    const attendance = await Attendance.create({
      studentId: req.user.id,
      sessionId,
      status,
      deviceId,
      latitude,
      longitude,
    });
    const io = req.app.get("io");

    io.to(sessionId).emit("attendance:update", {
      studentName: req.user.name,
      studentId: req.user.id,
      status: attendance.status,
      timestamp: attendance.timestamp,
      latitude: attendance.latitude,
      longitude: attendance.longitude,
    });

    return res.status(201).json({ attendance, status });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSessionAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      sessionId: req.params.id,
    }).populate("studentId", "name email");

    return res.json({ attendance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      studentId: req.user.id,
    }).populate("sessionId", "course startTime");

    return res.json({ attendance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const [present, late, checkedInCount, enrolledCount] = await Promise.all([
      Attendance.countDocuments({
        sessionId: session._id,
        status: "present",
      }),
      Attendance.countDocuments({
        sessionId: session._id,
        status: "late",
      }),
      Attendance.countDocuments({
        sessionId: session._id,
      }),
      User.countDocuments({
        role: "student",
        courses: session.course,
      }),
    ]);
    const absent = Math.max(enrolledCount - checkedInCount, 0);

    return res.json({ present, late, absent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAttendance,
  getSessionAttendance,
  getMyAttendance,
  getAnalytics,
};
