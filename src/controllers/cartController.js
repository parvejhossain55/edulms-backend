const cartService = require("../services/cartService");

exports.getCartByUser = async (req, res, next) => {
  try {
    const { status, cart } = await cartService.getUserCart(req.auth._id);
    res.status(status).json(cart);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.addToCart = async (req, res, next) => {
  // console.log("req auth", req.auth);
  // console.log("req body", req.body);
  try {
    const { courseId } = req.body;
    const { status, message } = await cartService.addCartService({
      userId: req.auth._id,
      courseId,
    });
    res.status(status).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { status, cart } = await cartService.removeCartItem(
      req.auth._id,
      courseId
    );
    res.status(status).json(cart);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
