const mongoose = require("mongoose");

const RequestProgressService = new mongoose.Schema(
  {},
  {
    timeseries: true,
  }
);

module.exports = mongoose.model("RequestProgress", RequestProgressService);
