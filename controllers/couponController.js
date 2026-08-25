const CouponService = require("../services/couponService");

// create a new coupon
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await CouponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// get a specific coupon by code
exports.applyCouponCode = async (req, res, next) => {
  try {
    const { status, message } = await CouponService.applyCouponCode(
      req.params.code,
      req.auth._id
    );
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

// get all coupons
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await CouponService.getAllCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

// update a specific coupon by code
exports.updateCouponByCode = async (req, res, next) => {
  try {
    const coupon = await CouponService.updateCouponByCode(
      req.params.code,
      req.body
    );
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

// delete a specific coupon by code
exports.deleteCouponByCode = async (req, res, next) => {
  try {
    const result = await CouponService.deleteCouponByCode(req.params.code);
    if (!result) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon Successfully Deleted" });
  } catch (error) {
    next(error);
  }
};
