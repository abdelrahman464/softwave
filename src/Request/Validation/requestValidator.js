const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../../utils/apiError");
const Requst = require("../models/requstModel");
const Service = require("../../Service/Models/serviceModel");
const Question = require("../models/requstModel");

exports.createValidatior = [
  check("service")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (serviceId) => {
      const service = await Service.findById(serviceId);
      if (!service) {
        return ApiError(`Service with id ${serviceId} not found`, 404);
      }
    }),
  check("note")
    .optional()
    .isString()
    .withMessage("note must be a string")
    .isLength({ max: 300 })
    .withMessage("To long note")
    .escape()
    .withMessage("note contains invalid characters"),
  check("questionsAnswers")
    .isArray()
    .withMessage("questionsAnswers must be an array")
    .custom((questionsAnswers) => {
      //1- check size of questionsAnswers
      if (questionsAnswers.length === 0) {
        return ApiError("questionsAnswers is empty");
      }
      questionsAnswers.forEach(async (questionObject) => {
        //2- check if questionId and answer are seubmitted
        if (!questionObject.questionId || !questionObject.answer) {
          return ApiError("questionId and answer are required");
        }
        //3- check if questionId is valid
        const question = await Question.findById(questionObject.questionId);
        if (!question) {
          return ApiError(
            `Question with id ${questionObject.questionId} not found`,
            404
          );
        }
        //4- check if answer is string
        if (typeof question.answer !== "string") {
          return ApiError("invalid question answer type");
        }
      });
      return true;
    }),
  validatorMiddleware,
];
exports.updateValidatior = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (requstId) => {
      const requst = await Requst.findById;
      if (!requst) {
        return ApiError(`Requst with id ${requstId} not found`, 404);
      }
    }),
  check("cost")
    .optional()
    .isNumeric()
    .withMessage("Request cost must be a number")
    .isLength({ min: 1 })
    .withMessage("Request cost must be greater than 1")
    .isLength({ max: 5000 })
    .withMessage("To long cost"),
  check("status")
    .optional()
    .isIn(["pending", "inProgress", "completed", "canceled"])
    .withMessage("Invalid status")
    .escape()
    .withMessage("status contains invalid characters"),

  validatorMiddleware,
];
exports.addMeetingValidatior = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (requstId) => {
      const requst = await Requst.findById;
      if (!requst) {
        return ApiError(`Requst with id ${requstId} not found`, 404);
      }
    }),
  check("link")
    .notEmpty()
    .withMessage("meeting link is required")
    .escape()
    .withMessage("link contains invalid characters"),
  check("date")
    .notEmpty()
    .withMessage("meeting date is required")
    .escape()
    .withMessage("date contains invalid characters"),
  check("about")
    .notEmpty()
    .withMessage("about is required")
    .isString()
    .withMessage("about must be a string")
    .escape()
    .withMessage("about contains invalid characters"),

  validatorMiddleware,
];
exports.addBillValidatior = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (requstId) => {
      const requst = await Requst.findById;
      if (!requst) {
        return ApiError(`Requst with id ${requstId} not found`, 404);
      }
    }),
  check("cost")
    .notEmpty()
    .withMessage("cost is required")
    .isNumeric()
    .withMessage("Request cost must be a number")
    .isFloat({ min: 1, max: 5000 })
    .withMessage("cost must be a number between 1 and 5000"),

  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("description must be a string")
    .escape()
    .withMessage("description contains invalid characters"),

  validatorMiddleware,
];

// MIDDLWARES
// if role user check if user is the owner of the request
exports.requstAuthority = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    const requst = await Requst.findById(req.params.id);
    if (requst.user._id.toString() !== req.user._id.toString()) {
      return next(new ApiError(`you are not the owner of this request`, 401));
    }
  }
  next();
});
