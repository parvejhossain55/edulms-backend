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
    const { status, url } = await CheckoutService.checkoutCart(
      req.auth._id,
      req.body
    );
    // console.log(url);
    res.status(status).json(url);
  } catch (err) {
    next(err);
  }
};

exports.checkoutFail = async (req, res, next) => {
  try {
    const { status, url } = await CheckoutService.checkoutCart(
      req.auth._id,
      req.body
    );
    // console.log(url);
    res.status(status).json(url);
  } catch (err) {
    next(err);
  }
};
