const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["present", "late"],
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

attendanceSchema.index({ sessionId: 1 });
attendanceSchema.index({ deviceId: 1 });
attendanceSchema.index({ sessionId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
