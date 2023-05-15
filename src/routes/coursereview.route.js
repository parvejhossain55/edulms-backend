const router = require("express").Router();
const { authVerifyMiddleware } = require("../middleware/authMiddleware");
const courseReviewController = require("../controllers/course/courseReviewController");

router.post(
  "/courses/:courseId/reviews",
  authVerifyMiddleware,
  courseReviewController.addReview
);

module.exports = router;
