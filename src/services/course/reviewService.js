const error = require("../../helpers/error");
const Review = require("../../models/CourseReview");
const Purchase = require("../../models/Purchase");

exports.addReview = async ({ course, userId, rating, comment }) => {
  try {
    // Check if the user has purchased the course
    const purchase = await Purchase.find({
      user: userId,
      "courses.course": course,
    });

    if (purchase.length < 1) {
      throw error("Your are not eligible for this comment", 400);
    }

    // Create a new review
    const review = new Review({
      course: course,
      user: userId,
      rating,
      comment,
    });

    // Save the review to the database
    return await review.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getAllReviews = async (page, limit) => {
  try {
    const currentPage = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const totalReviews = await Review.countDocuments();
    const totalPages = Math.ceil(totalReviews / limitNumber);

    const reviews = await Review.find()
      .populate("user", "firstName lastName picture")
      .populate("course", "name thumbnail regularPrice sellPrice sellCount")
      .skip((currentPage - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

    return {
      reviews,
      currentPage,
      totalReviews,
      totalPages,
    };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.updateReview = async ({ reviewId, rating, comment, userId }) => {
  try {
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      throw error("Review not found", 400);
    }

    review.rating = rating;
    review.comment = comment;
    return await review.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.updateReviewStatus = async (reviewId, status) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw error("Review not found", 400);
    }

    review.status = status;

    await review.save();
    return { message: "Review Status Updated" };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.deleteReview = async (reviewId) => {
  try {
    const { acknowledged } = await Review.deleteOne({ _id: reviewId });
    if (acknowledged) {
      return { message: "Review Successfully Deleted" };
    }
    return { message: "Failed to Delete Review" };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getReviewsByCourse = async ({ courseId, page, limit }) => {
  try {
    const currentPage = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const query = { status: "published", course: courseId };

    const reviews = await Review.find(query, {
      user: 1,
      comment: 1,
      rating: 1,
      createdAt: 1,
    })
      .populate("user", "firstName lastName picture")
      .skip((currentPage - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limitNumber);

    return {
      reviews,
      currentPage,
      totalReviews,
      totalPages,
    };
  } catch (err) {
    throw error(err.message, err.status);
  }
};
