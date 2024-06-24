const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createSampleValidator = [
  check("title_en")
    .notEmpty()
    .withMessage("Sample english title required")
    .isLength({ min: 3 })
    .withMessage("Sample english title must be at least 3 chars")
    .custom((val, { req }) => {
      req.body.slug_en = slugify(val);
      return true;
    }),

  check("title_ar")
    .isLength({ min: 3 })
    .withMessage("Sample arabic title must be at least 3 chars")
    .notEmpty()
    .withMessage("Sample arabic title required")
    .custom((val, { req }) => {
      req.body.slug_ar = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.updateSampleValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  check("title_en")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Sample english title must be at least 3 chars")
    .custom((val, { req }) => {
      req.body.slug_en = slugify(val);
      return true;
    }),

  check("title_ar")
    .isLength({ min: 3 })
    .withMessage("Sample arabic title must be at least 3 chars")
    .optional()
    .custom((val, { req }) => {
      req.body.slug_ar = slugify(val);
      return true;
    }),

  validatorMiddleware,
];
