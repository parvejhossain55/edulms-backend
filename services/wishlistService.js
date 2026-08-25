const error = require("../helpers/error");
const Wishlist = require("../models/Wishlist");

// Add a course to a user's wishlist
exports.addToWishlist = async (userId, courseId) => {
  try {
    // Create a new wishlist if the user doesn't have any
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      const wishlist = new Wishlist({
        user: userId,
        courses: [{ course: courseId }],
      });
      wishlist.save();

      return { status: 201, message: "Course added to wishlist" };
    }

    // Check if the course is already in the wishlist
    if (wishlist.courses.some((item) => item.course == courseId)) {
      return { status: 200, message: "Course already in wishlist" };
    }

    // Add the course to the wishlist and save
    wishlist.courses.push({ course: courseId });
    await wishlist.save();

    return { status: 201, message: "Course added to wishlist", wishlist };
  } catch (err) {
    throw error("Course Failed to Add Wishlist", err.status);
  }
};

// Get a user's wishlists
exports.getWishlists = async (userId) => {
  try {
    const wishlists = await Wishlist.findOne({ user: userId }).populate(
      "courses.course"
    );

    return {
      status: 200,
      courses: wishlists.courses,
    };
  } catch (err) {
    throw error("Failed to Get Course Wishlist", err.status);
  }
};

// Remove a course from a user's wishlist
exports.removeFromWishlist = async (userId, courseId) => {
  try {
    await Wishlist.updateOne(
      { user: userId },
      { $pull: { courses: { course: courseId } } }
    );
    return { status: 200, message: "Course successfully removed" };
  } catch (err) {
    throw error("Failed to Remove Course Wishlist", err.status);
  }
};
