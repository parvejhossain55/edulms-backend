const router = require("express").Router();
const { authVerifyMiddleware } = require("../middleware/authMiddleware");
const CheckoutController = require("../controllers/checkoutController");

router.post(
  "/checkout/course",
  authVerifyMiddleware,
  CheckoutController.checkoutCart
);
router.post("/checkout/success", CheckoutController.checkoutSuccess);
router.post("/checkout/cancel", CheckoutController.checkoutCancel);
router.post("/checkout/fail", CheckoutController.checkoutFail);

module.exports = router;
