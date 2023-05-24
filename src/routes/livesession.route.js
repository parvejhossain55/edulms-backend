const router = require("express").Router();
const SessionController = require("../controllers/liveSessionController");
const { authVerifyMiddleware } = require("../middleware/authMiddleware");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

router.post(
  "/live-session",
  authVerifyMiddleware,
  upload.single("thumbnail"),
  uploadToCloudinary,
  SessionController.createSession
);

router.get(
  "/live-session/course",
  authVerifyMiddleware,
  SessionController.getSessionsByCourse
);
router.get(
  "/live-session/upcoming",
  authVerifyMiddleware,
  SessionController.getUpcomingFirstSession
);

module.exports = router;
