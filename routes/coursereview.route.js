const router = require("express").Router();
const {
  authVerifyMiddleware,
  isAdmin,
} = require("../middleware/authMiddleware");
const courseReviewController = require("../controllers/course/courseReviewController");

router.post(
  "/courses/:courseId/reviews",
  authVerifyMiddleware,
  courseReviewController.addReview
);

router.put(
  "/courses/:reviewId/reviews",
  authVerifyMiddleware,
  courseReviewController.updateReview
);

router.patch(
  "/reviews/:reviewId/status",
  authVerifyMiddleware,
  isAdmin,
  courseReviewController.updateReviewStatus
);

router.delete(
  "/reviews/:reviewId",
  authVerifyMiddleware,
  isAdmin,
  courseReviewController.deleteReview
);

router.get(
  "/course/:courseId/reviews",
  courseReviewController.getReviewsByCourse
);
router.get("/reviews", courseReviewController.getAllReviews);

module.exports = router;
