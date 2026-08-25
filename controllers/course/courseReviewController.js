const FormHelper = require("../../helpers/FormHelper");
const reviewService = require("../../services/course/reviewService");

exports.addReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.auth._id;

    if (!FormHelper.isIdValid(courseId)) {
      return res.status(400).json({ error: "Provide valid Course Id" });
    }
    if (FormHelper.isEmpty(comment)) {
      return res.status(400).json({ error: "Comment is required" });
    }
    if (FormHelper.isEmpty(rating)) {
      return res.status(400).json({ error: "Rating is required" });
    }

    const review = await reviewService.addReview({
      course: courseId,
      userId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.auth._id;

    if (!FormHelper.isIdValid(reviewId)) {
      return res.status(400).json({ error: "Provide valid Review Id" });
    }
    if (FormHelper.isEmpty(comment)) {
      return res.status(400).json({ error: "Comment is required" });
    }
    if (FormHelper.isEmpty(rating)) {
      return res.status(400).json({ error: "Rating is required" });
    }

    const reviews = await reviewService.updateReview({
      reviewId,
      rating,
      comment,
      userId,
    });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (FormHelper.isEmpty(status)) {
      return res.status(400).json({ error: "Reveiw Status is required" });
    }

    const review = await reviewService.updateReviewStatus(reviewId, status);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    if (!FormHelper.isIdValid(reviewId)) {
      return res.status(400).json({ error: "Provide valid Review Id" });
    }
    const review = await reviewService.deleteReview(reviewId);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const reviews = await reviewService.getAllReviews(page, limit);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.getReviewsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page, limit } = req.query;
    if (!FormHelper.isIdValid(courseId)) {
      return res.status(400).json({ error: "Provide valid Course Id" });
    }
    const reviews = await reviewService.getReviewsByCourse({
      courseId,
      page,
      limit,
    });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};
