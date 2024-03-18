const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.MongoIdValidator = (fieldName = "id") => [
  check(fieldName).isMongoId().withMessage(`Invalid ID format`),
  // Catch error
  validatorMiddleware,
];
