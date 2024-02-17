const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.MongoIdValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid  id format"),
  //catch error
  validatorMiddleware,
];
