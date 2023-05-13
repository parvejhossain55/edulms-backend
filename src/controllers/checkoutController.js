const CheckoutService = require("../services/checkoutService");

exports.checkoutCart = async (req, res, next) => {
  try {
    const checkout = await CheckoutService.checkoutCart(req.auth._id, req.body);
    res.status(200).json(checkout);
  } catch (err) {
    next(err);
  }
};

exports.checkoutSuccess = async (req, res) => {
  try {
    // return res.json(req.body);
    const success_url = await CheckoutService.checkoutSuccess(req.body);
    res.redirect(success_url);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkoutCancel = async (req, res, next) => {
  try {
    // provide cancel route link
    res.redirect("http://google.com");
  } catch (err) {
    next(err);
  }
};

exports.checkoutFail = async (req, res, next) => {
  try {
    // provide fail route link
    res.redirect("http://google.com");
  } catch (err) {
    next(err);
  }
};

// Baintree payment gateway integration
exports.clientToken = async (req, res, next) => {
  try {
    const token = await CheckoutService.clientToken(req);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.braintreeCheckout = async (req, res, next) => {
  try {
    const checkout = await CheckoutService.braintreeCheckout(
      req.auth,
      req.body
    );
    res.json(checkout);
  } catch (err) {
    next(err);
  }
};
