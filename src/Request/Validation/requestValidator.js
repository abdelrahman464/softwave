const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../../utils/apiError");
const Requst = require("../models/requstModel");

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
