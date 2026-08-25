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

// braintree payment gateway integration
router.get(
  "/client-token",
  authVerifyMiddleware,
  CheckoutController.clientToken
);
router.post(
  "/checkout/braintree",
  authVerifyMiddleware,
  CheckoutController.braintreeCheckout
);

module.exports = router;
