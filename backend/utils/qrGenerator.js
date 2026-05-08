const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const generateQRToken = () => {
  return uuidv4();
};

const generateQRCode = async (token) => {
  return QRCode.toDataURL(token);
};

module.exports = {
  generateQRToken,
  generateQRCode,
};
