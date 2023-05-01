const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const paymentSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    amount: {
      type: String,
      required: [true, "Amount is required"],
    },
    store_amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: { type: String, required: true },
    tran_id: { type: String, required: true },
    tran_date: { type: Date, required: true },
    bank_tran_id: { type: String, required: true },
    card_type: { type: String, required: true },
    card_brand: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Payment = model("Payment", paymentSchema);

module.exports = Payment;
