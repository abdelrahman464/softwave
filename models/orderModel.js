const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },
    request: {
      type: mongoose.Schema.ObjectId,
      ref: "Request",
      required: [true, "Request must be belong to user"],
    },
    description: {
      type: String,
      required: [true, "order description is required"],
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamp: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name phone email " });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
