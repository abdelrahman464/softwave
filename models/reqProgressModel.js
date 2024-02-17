const mongoose = require("mongoose");

const RequestProgressService = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
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
