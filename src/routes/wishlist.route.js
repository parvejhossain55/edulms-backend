const router = require("express").Router();
const WishlistController = require("../controllers/wishlistController");
const { authVerifyMiddleware } = require("../middleware/authMiddleware");

// Add course to a user wishlist
router.post(
  "/wishlist",
  authVerifyMiddleware,
  WishlistController.addToWishlist
);

// Get user wishlists
router.get("/wishlist", authVerifyMiddleware, WishlistController.getWishlists);

// Remove course from a user wishlist
router.delete(
  "/wishlist/:courseId",
  authVerifyMiddleware,
  WishlistController.removeFromWishlist
);

module.exports = router;
