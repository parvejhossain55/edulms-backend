const purchaseTemplate = require("../emailTemplate/purchaseCourse");
const error = require("../helpers/error");
const sendEmail = require("../helpers/sendEmail");
const transactionId = require("../helpers/transactionId");
const Cart = require("../models/Cart");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const Purchase = require("../models/Purchase");
const SSLCommerzPayment = require("sslcommerz-lts");
const braintree = require("braintree");

const sslcommerz = new SSLCommerzPayment(
  process.env.STORE_ID,
  process.env.STORE_PASSWORD,
  false
);

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.checkoutCart = async (userId, courseData) => {
  const {
    name,
    email,
    phone,
    address,
    country,
    city,
    state,
    zip,
    course_name,
  } = courseData;
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw error("Cart Not Found", 404);
    }

    const data = {
      total_amount: cart.total,
      currency: "BDT",
      tran_id: transactionId(), // use unique tran_id for each api call
      success_url: `${process.env.BASE_URL}/checkout/success`,
      fail_url: `${process.env.BASE_URL}/checkout/fail`,
      cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
      ipn_url: `${process.env.BASE_URL}/checkout/ipn`,
      shipping_method: "NO",
      product_name: course_name,
      product_category: "Online Course",
      product_profile: "Course",
      cus_name: name,
      cus_email: email,
      cus_add1: address,
      cus_add2: address,
      cus_city: city,
      cus_state: state,
      cus_postcode: zip,
      cus_country: country,
      cus_phone: phone,
      cus_fax: phone,
      ship_name: name,
      ship_add1: address,
      ship_add2: address,
      ship_city: city,
      ship_state: state,
      ship_postcode: 1000,
      ship_country: country,
      value_a: userId.toString(),
      value_b: name,
      value_c: email,
    };

    const payment = await sslcommerz.init(data);

    return {
      // status: 200,
      url: payment.GatewayPageURL,
    };
  } catch (error) {
    throw error("Failed to chekcout cart", error.status);
  }
};

exports.checkoutSuccess = async (success) => {
  try {
    // Validate the payment
    const validate = await sslcommerz.validate(success);
    const {
      status,
      tran_id,
      tran_date,
      amount,
      store_amount,
      bank_tran_id,
      card_type,
      card_brand,
      card_issuer,
      value_a,
      value_b,
      value_c,
    } = validate;

    if (status !== "VALID") {
      throw error("Payment validation failed.", 400);
    }

    // Retrieve the user's cart
    const cart = await Cart.findOne({ user: value_a }).populate(
      "courses.course",
      "name"
    );

    // Create the new order
    const purchase = new Purchase({
      user: value_a,
      courses: cart.courses.map((course) => ({
        course: course.course,
        price: course.price,
      })),
      total: cart.total,
    });

    // create payment
    const payment = new Payment({
      user: value_a,
      amount,
      store_amount,
      paymentMethod: card_issuer,
      paymentStatus: status === "VALID" ? "Paid" : "Unpaid",
      tran_id,
      tran_date,
      bank_tran_id,
      card_brand,
      card_type,
    });

    purchase.payment = payment._id;

    // Update product sold and quantity
    await quantityUpdate(cart);

    // order detail for send email
    const info = {
      name: value_b,
      title: cart.courses.reduce(
        (acc, course) => acc + course.course.name + " | ",
        ""
      ),
      amount: cart.total,
      method: card_issuer,
      tran_id,
      date: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
      }),
    };

    // Clear the user's cart
    cart.courses = [];
    cart.total = 0;
    cart.couponApplied = false;

    const mailbody = purchaseTemplate(info);

    // email send hole resolve kore data save korte hobe otherwise order failed kore dite hobe
    const sendMail = await sendEmail(
      value_c,
      mailbody,
      "Course Purchase Confirmation"
    );

    if (sendMail[0].statusCode !== 202) {
      return `${process.env.FONTEND_URL}/purchase-failed/${JSON.stringify(
        info
      )}`;
    }

    // Save the purchase and payment
    await Promise.all([purchase.save(), cart.save(), payment.save()]);

    return `${process.env.FONTEND_URL}/purchase-success/${JSON.stringify(
      info
    )}`;
  } catch (error) {
    throw error("Invalid Payment. Can't create order", error.status);
  }
};

// braintree payment gateway integration
exports.clientToken = async () => {
  const { clientToken } = await gateway.clientToken.generate({});
  return clientToken;
};

exports.braintreeCheckout = async (
  { _id, firstName, lastName, email },
  { nonce }
) => {
  try {
    // Retrieve the user's cart
    const cart = await Cart.findOne({ user: _id }).populate(
      "courses.course",
      "name"
    );

    if (!cart) throw error("Cart is Empty", 400);

    // Create the Braintree transaction
    const { success, transaction } = await gateway.transaction.sale({
      amount: cart.total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (!success) throw error("Transaction Failed", 400);

    if (
      transaction.status === "failed" ||
      transaction.status === "gateway_rejected"
    ) {
      throw error("Payment is Failed or Rejected");
    }

    // Create the new order
    const purchase = new Purchase({
      user: _id,
      courses: cart.courses.map((course) => ({
        course: course.course,
        price: course.price,
      })),
      total: cart.total,
    });

    // create payment
    const payment = new Payment({
      user: _id,
      amount: transaction.amount,
      paymentMethod: transaction.paymentInstrumentType,
      paymentStatus: transaction.status,
      tran_id: transaction.id,
      tran_date: transaction.createdAt,
      card_type: transaction.creditCard.cardType || "Other",
    });

    purchase.payment = payment._id;

    // Update product sold and quantity
    await quantityUpdate(cart);

    // order detail for send email
    const info = {
      name: firstName + " " + lastName,
      title: cart.courses.reduce(
        (acc, course) => acc + course.course.name + " | ",
        ""
      ),
      amount: cart.total,
      method: transaction.paymentInstrumentType,
      tran_id: transaction.id,
      date: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
      }),
    };

    // Clear the user cart
    cart.courses = [];
    cart.total = 0;
    cart.couponApplied = false;

    const mailbody = purchaseTemplate(info);

    // email send hole resolve kore data save korte hobe otherwise order failed kore dite hobe
    const sendMail = await sendEmail(
      email,
      mailbody,
      "Course Purchase Confirmation"
    );

    if (sendMail[0].statusCode !== 202) {
      throw error("Failed to send email", 400);
    }

    // Save the purchase and payment
    await Promise.all([purchase.save(), cart.save(), payment.save()]);
    // await Promise.all([purchase.save(), cart.save(), payment.save()]);

    return { message: "Purchases Successfull" };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

async function quantityUpdate(cart) {
  await Course.bulkWrite(
    cart.courses.map((course) => ({
      updateOne: {
        filter: { _id: course.course },
        update: { $inc: { sellCount: 1 } },
      },
    }))
  );
}
