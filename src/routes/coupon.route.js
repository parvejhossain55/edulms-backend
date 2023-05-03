const router = require("express").Router();
const CouponController = require("../controllers/couponController");
const {
  authVerifyMiddleware,
  isAdmin,
} = require("../middleware/authMiddleware");

router.post(
  "/coupons",
  authVerifyMiddleware,
  isAdmin,
  CouponController.createCoupon
);

// apply coupon route
router.get(
  "/coupons/:code",
  authVerifyMiddleware,
  CouponController.applyCouponCode
);

router.get(
  "/coupons",
  authVerifyMiddleware,
  isAdmin,
  CouponController.getAllCoupons
);

router.put(
  "/coupons/:code",
  authVerifyMiddleware,
  isAdmin,
  CouponController.updateCouponByCode
);

router.delete(
  "/coupons/:code",
  authVerifyMiddleware,
  isAdmin,
  CouponController.deleteCouponByCode
);

module.exports = router;
