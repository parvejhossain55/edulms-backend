// services/reviews.js
const Review = require("../../models/CourseReview");
const Purchase = require("../../models/Purchase");

exports.addReview = async ({ courseId, userId, rating, comment }) => {
  // Check if the user has purchased the course
  const purchase = await Purchase.findOne({
    user: userId,
    course: courseId,
  });

  if (!purchase) {
    throw new Error("Unauthorized");
  }

  // Create a new review
  const review = new Review({
    course: courseId,
    user,
    rating,
    comment,
  });

  // Save the review to the database
  await review.save();
};
