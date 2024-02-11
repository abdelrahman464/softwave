const mongoose = require("mongoose");

const userRequestSchema = mongoose.Schema(
  {
    user: {
      required: [true, "user is required"],
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    service: {
      required: [true, "service is required"],
      type: mongoose.Schema.ObjectId,
      ref: "Service",
    },
    textarea: {
      type: String,
      required: [true, "textarea is required"],
    },
    price: {
      type: Number,
      required: [true, "service price is required"],
      trim: true,
      max: [200000, "Too long service price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["completed", "working", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

userRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email profileImg -_id",
  }).populate({
    path: "service",
    select: "title_en category",
  });

  next();
});

module.exports = mongoose.model("Request", userRequestSchema);
