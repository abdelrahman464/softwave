const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short sample title"],
      maxlength: [100, "too Shot sample title"],
    },
    description_ar: {
      type: String,
      required: [true, "sample description is required"],
      trim: true,
      minlength: [20, "Too short sample description"],
    },
    description_en: {
      type: String,
      required: [true, "sample description is required"],
      trim: true,
      minlength: [20, "Too short sample description"],
    },
    imageCover: {
      type: String,
      required: [true, "service image cover is required"],
    },
    images: [String],
    link: String,
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: [true, "service is required"],
    },
  },
  {
    timeseries: true,
  }
);

module.exports = mongoose.model("Samples", serviceSchema);
