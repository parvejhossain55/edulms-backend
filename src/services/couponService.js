const sendError = require("../helpers/error");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");

// create a new coupon
exports.createCoupon = async (couponData) => {
  try {
    const coupon = new Coupon(couponData);
    await coupon.save();
    return { message: "Coupon Successfully Created" };
  } catch (error) {
    sendError(error.message);
  }
};

// get a specific coupon by code
exports.applyCouponCode = async (code, userid) => {
  try {
    const coupon = await Coupon.findOne({ code });
    const cart = await Cart.findOne({ user: userid });

    if (!coupon) return { status: 404, message: "Coupon Not Found" };
    if (!cart || cart.courses.length < 1)
      return { status: 404, message: "Cart Is Empty" };

    const totalPrice = cart.courses.reduce(
      (total, course) => total + course.price,
      0
    );

    if (cart.couponApplied)
      return { status: 400, message: "Coupon Already Applied" };

    if (totalPrice < coupon.minPurchase)
      return {
        status: 400,
        message: `Plesase order more than ${coupon.minPurchase} BDT`,
      };

    const currentDate = new Date().getTime();

    if (currentDate > coupon.expirationDate.getTime())
      return { status: 400, message: "Coupon has expired" };

    if (coupon.usageLimit <= 0)
      return { status: 400, message: "Coupon usage limit exceeded" };

    // apply course check korte hobe
    if (coupon.applicableCourse[0] == "all") {
      cart.total -= calculateDiscount(coupon, totalPrice);
      cart.couponApplied = true;
      coupon.usageLimit -= 1;

      await Promise.all([cart.save(), coupon.save()]);
      return { status: 200, message: "Coupon Succesfully Applied" };
    }

    for (let applicableCourse of coupon.applicableCourse) {
      const isAddedCourse = cart.courses.some(
        (course) => course.course.toString() === applicableCourse
      );

      if (isAddedCourse) {
        cart.total -= calculateDiscount(coupon, totalPrice);
        cart.couponApplied = true;
        coupon.usageLimit -= 1;

        await Promise.all([cart.save(), coupon.save()]);
        return { status: 200, message: "Coupon Succesfully Applied" };
      }
    }

    return { status: 400, message: "You are not eligible for this coupon" };
  } catch (error) {
    sendError(error.message, 500);
  }
};

const calculateDiscount = (coupon, subTotal) => {
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (coupon.discountAmount / 100) * subTotal;
  } else if (coupon.discountType === "fixed") {
    discount = coupon.discountAmount;
  }
  return discount;
};

// get all coupons
exports.getAllCoupons = async () => {
  try {
    const coupons = await Coupon.find();
    return coupons;
  } catch (error) {
    sendError(error.message);
  }
};

// update a specific coupon by code
exports.updateCouponByCode = async (code, couponData) => {
  try {
    const coupon = await Coupon.findOneAndUpdate({ code }, couponData, {
      new: true,
    });
    return coupon;
  } catch (error) {
    sendError(error.message);
  }
};

// delete a specific coupon by code
exports.deleteCouponByCode = async (code) => {
  try {
    const result = await Coupon.findOneAndDelete({ code });
    return result;
  } catch (error) {
    sendError(error.message);
  }
};
