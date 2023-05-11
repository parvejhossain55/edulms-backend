const Cart = require("../models/Cart");
const Course = require("../models/Course");
const error = require("../helpers/error");

exports.getUserCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "courses.course",
      "name thumbnail"
    );

    return { status: 200, cart };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.addCartService = async ({ userId, courseId }) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    const course = await Course.findById(courseId);

    if (!course) {
      return { status: 404, message: "Course Not Found" };
    }

    if (!cart) {
      // If cart is null, create a new cart for the user
      const newCart = new Cart({
        user: userId,
        courses: [
          {
            course: courseId,
            price: course.sellPrice,
          },
        ],
        total: course.sellPrice,
      });
      await newCart.save();
      return { status: 201, message: "Course added to your cart." };
    }

    // Check if the course exists or not
    const isExistCourse = cart.courses.find(
      (course) => course.course.toString() === courseId
    );

    if (isExistCourse) {
      return { status: 400, message: "Course already added in your cart." };
    } else {
      // If the course doesn't exist in the cart, add it as a new course
      cart.courses.push({
        course: courseId,
        price: course.sellPrice,
      });
    }

    // Update the total cost of the cart
    cart.total = cart.courses.reduce((acc, course) => acc + course.price, 0);

    // Save the cart to the database
    await cart.save();

    return { status: 200, message: "Course Successfully added to your Cart" };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.removeCartItem = async (userId, courseId) => {
  try {
    const cart = await Cart.findOne({ user: userId });

    cart.courses = cart.courses.filter(
      (course) => course._id.toString() !== courseId
    );

    // Update the total cost of the cart
    cart.total = cart.courses.reduce((acc, course) => acc + course.price, 0);

    // Save the cart to the database
    await cart.save();

    const { courses } = await Cart.findOne({ user: userId }).populate(
      "courses.course"
    );

    return { status: 200, cart: courses };
  } catch (err) {
    throw error(err.message, err.status);
  }
};
// api test korte cart item remove er
