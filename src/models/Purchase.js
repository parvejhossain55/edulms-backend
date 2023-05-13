const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // payment object for ssl commerze
    // payment: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Payment",
    //   required: true,
    // },
    // payment object for braintree
    payment: {},
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
