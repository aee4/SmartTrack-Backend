const Session = require("../models/Session");
const { generateQRToken, generateQRCode } = require("../utils/qrGenerator");

const createSession = async (req, res) => {
  try {
    const { course } = req.body;

    const session = await Session.create({
      lecturerId: req.user.id,
      course,
      activeStatus: false,
    });

    return res.status(201).json({ session });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const startSession = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const session = await Session.findOne({
      _id: req.params.id,
      lecturerId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const qrExpiryMinutes = Number(process.env.QR_EXPIRY_MINUTES) || 5;
    const qrToken = generateQRToken();

    session.activeStatus = true;
    session.startTime = Date.now();
    session.latitude = latitude;
    session.longitude = longitude;
    session.qrToken = qrToken;
    session.qrExpiry = new Date(Date.now() + qrExpiryMinutes * 60 * 1000);

    const qrCode = await generateQRCode(qrToken);
    await session.save();

    return res.json({ session, qrCode });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const stopSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      lecturerId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.activeStatus = false;
    session.endTime = Date.now();

    await session.save();

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      lecturerId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ lecturerId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession,
  startSession,
  stopSession,
  getSession,
  getMySessions,
};
