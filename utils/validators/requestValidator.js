const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.setReqeustPriceValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Request price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  

  validatorMiddleware,
];
