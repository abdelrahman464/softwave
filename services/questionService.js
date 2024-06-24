const Question = require("../models/questionModel");
const factory = require("./handllerFactory");

//@desc get list of Questions
//@route GET /api/v1/Questions
//@access public
exports.getQuestions = factory.getALl(Question, "Serivce");
//@desc get specific Question by id
//@route GET /api/v1/Questions/:id
//@access public
exports.getQuestion = factory.getOne(Question);
//@desc create question
//@route POST /api/v1/Questions
//@access private
exports.createQuestion = factory.createOne(Question);
//@desc update specific Question
//@route PUT /api/v1/Questions/:id
//@access private
exports.updateQuestion = factory.updateOne(Question);
//@desc delete Question
//@route DELETE /api/v1/Questions/:id
//@access private
exports.deleteQuestion = factory.deleteOne(Question);

// exports.getQuestionsByService = async (req, res) => {
//   const { id } = req.params;
//   const questions = await Question.find({ service: id });
//   if (!questions) {
//     return res.status(404).json({ message: "No questions for this service" });
//   }
//   return res.status(200).json({ data: questions });
// };
//filter questions in specefic serveic by serviceId
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.serviceId) filterObject = { service: req.params.serviceId };
  req.filterObj = filterObject;
  next();
};
