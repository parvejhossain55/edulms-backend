const router = require("express").Router();
const SessionController = require("../controllers/liveSessionController");
const { authVerifyMiddleware } = require("../middleware/authMiddleware");

router.post(
  "/live-session",
  authVerifyMiddleware,
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
