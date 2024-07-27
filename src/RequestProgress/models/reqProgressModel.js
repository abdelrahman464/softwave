const mongoose = require("mongoose");

const RequestProgressService = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    reviewMeeting: {
      type: Date,
    },
  },
  {
    timeseries: true,
  }
);

module.exports = mongoose.model("RequestProgress", RequestProgressService);
