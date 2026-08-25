const wishlistService = require("../services/wishlistService");

// Add a product to a user's wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.auth._id;
    const { courseId } = req.body;
    const { status, message } = await wishlistService.addToWishlist(
      userId,
      courseId
    );
    res.status(status).json({ message });
  } catch (err) {
    next(err);
  }
};

// Get a user's wishlists
exports.getWishlists = async (req, res, next) => {
  try {
    const { status, courses } = await wishlistService.getWishlists(
      req.auth._id
    );
    res.status(status).json(courses);
  } catch (err) {
    next(err);
  }
};

// Remove a product from a user's wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { status, message } = await wishlistService.removeFromWishlist(
      req.auth._id,
      req.params.courseId
    );
    res.status(status).json({ message });
  } catch (err) {
    next(err);
  }
};
