const router = require("express").Router();
const SessionController = require("../controllers/liveSessionController");
const { authVerifyMiddleware } = require("../middleware/authMiddleware");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

router.delete(
  "/live-session/:id",
  authVerifyMiddleware,
  SessionController.deleteSessionById
);

router.post(
  "/live-session",
  authVerifyMiddleware,
  upload.single("thumbnail"),
  uploadToCloudinary,
  SessionController.createSession
);

router.patch(
  "/live-session/:id",
  authVerifyMiddleware,
  upload.single("thumbnail"),
  uploadToCloudinary,
  SessionController.updateSession
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

router.get(
  "/live-session/:id",
  authVerifyMiddleware,
  SessionController.getSessionsById
);

module.exports = router;
