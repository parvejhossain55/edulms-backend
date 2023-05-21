const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
    {
          studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
          required: true,
        },
        price: {
            type: Number,
            required: true,
        },
   /* courses: [
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
    ],*/
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
