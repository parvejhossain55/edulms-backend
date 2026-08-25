const rateLimit = require("express-rate-limit");

// Strict limiter for sensitive auth endpoints (login, OTP, password reset)
// to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});

// Slightly relaxed limiter for OTP resend endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many OTP requests, please try again later" },
});

module.exports = { authLimiter, otpLimiter };
