const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
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

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.patch('/auth/setpassword/:token', authController.setPassword);
router.get('/auth/:email/:otp', authController.verifyOTP);
router.patch('/auth/:email/:otp', authController.resetPassword);
router.get('/auth/:email', authController.sendOtp);
router.patch('/auth/password', authMiddleware.authVerifyMiddleware , authController.passwordChange);
router.post("/auth/social-login", authController.socialLogin);


module.exports = router;