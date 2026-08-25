const crypto = require("crypto");
const OtpModel = require("../models/Otp");

// Generate a cryptographically secure 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 1000000);

const findOptByProperty = (propertyObj, projection = null, options = null) => {
  if (options !== null) {
    return OtpModel.findOne(propertyObj, projection, options);
  }
  return OtpModel.findOne(propertyObj);
};

const updateOtp = ({ email, otp, status, options = null }) => {
  if (options !== null) {
    return OtpModel.updateOne({ email: email, otp: otp, status: status }, { otp: "" }, options);
  }
  return OtpModel.updateOne({ email }, { $set: { otp, status: status } }, { new: true });
};

const createOtp = ({ email, otp }) => {
  const newOtp = new OtpModel({ email, otp });
  return newOtp.save();
};

module.exports = {
  generateOtp,
  findOptByProperty,
  updateOtp,
  createOtp,
};
