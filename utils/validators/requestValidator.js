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
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Request price After Discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (!req.body.price) {
        throw new Error("price cannot be empty");
      }
      if (req.body.price <= value) {
        throw new Error("price After Discount must be lower than price");
      }
      return true;
    }),

  validatorMiddleware,
];
