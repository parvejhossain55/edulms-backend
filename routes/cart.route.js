const router = require("express").Router();
const CartController = require("../controllers/cartController");
const { authVerifyMiddleware } = require("../middleware/authMiddleware");

router.get("/get-cart", authVerifyMiddleware, CartController.getCartByUser);
router.post("/add-cart", authVerifyMiddleware, CartController.addToCart);
router.delete(
  "/cart/:courseId",
  authVerifyMiddleware,
  CartController.removeCartItem
);

module.exports = router;
