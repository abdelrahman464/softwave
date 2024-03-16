// database
const mongoose = require("mongoose");
//1- create schema
const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    // string Number file 
  },
  options: {
    type: [String], // Specify that options is an array of strings
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
});

//2- create model
const QuestionModel = mongoose.model("Question", questionSchema);

module.exports = QuestionModel;
