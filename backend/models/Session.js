const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  radius: {
    type: Number,
    default: 50,
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  qrToken: {
    type: String,
    default: null,
  },
  qrExpiry: {
    type: Date,
    default: null,
  },
  activeStatus: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

sessionSchema.index({ lecturerId: 1 });

module.exports = mongoose.model("Session", sessionSchema);
