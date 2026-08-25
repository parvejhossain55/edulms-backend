const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const { authLimiter, otpLimiter } = require("../middleware/rateLimitMiddleware");
const router = require('express').Router();
router.get('/auth/auth-check', authMiddleware.authVerifyMiddleware, (req, res)=>{
    res.status(200).json({ok: true});
});

router.get('/auth/admin-check', authMiddleware.authVerifyMiddleware, authMiddleware.isAdmin, (req, res)=>{
    res.status(200).json({ok: true});
});

router.get('/auth/check-permission/:permission', authMiddleware.authVerifyMiddleware, authMiddleware.checkPermissionForFrontend, async (req, res) => {
    res.status(200).json({ ok: true });
});

router.post('/auth/register', authLimiter, authController.register);
router.post('/auth/login', authLimiter, authController.login);
router.patch('/auth/setpassword/:token', authLimiter, authController.setPassword);
router.get('/auth/:email/:otp', otpLimiter, authController.verifyOTP);
router.patch('/auth/:email/:otp', otpLimiter, authController.resetPassword);
router.get('/auth/:email', otpLimiter, authController.sendOtp);
router.patch('/auth/password', authMiddleware.authVerifyMiddleware , authController.passwordChange);
router.post("/auth/social-login", authLimiter, authController.socialLogin);


module.exports = router;