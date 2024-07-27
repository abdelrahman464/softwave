const mongoose = require("mongoose");
//1- create schema
const questionSchema = mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "radio", "checkbox"],
  },
  options: [String], // Specify that options is an array of strings
});
// ^find => it mean if part of of teh word contains find
questionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "service",
    select: "title_ar title_en",
  });
  next();
});
//2- create model
const QuestionModel = mongoose.model("Question", questionSchema);

module.exports = QuestionModel;
