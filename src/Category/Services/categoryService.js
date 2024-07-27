const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../../utils/apiError");
const {
  uploadSingleFile,
} = require("../../../middlewares/uploadImageMiddleware");
const Category = require("../Models/categoryModel");
const factory = require("../../../helpers/handllerFactory");
//upload Singel image
exports.uploadCategoryImage = uploadSingleFile("image");
//image processing
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const { file } = req; // Access the uploaded file
  if (file) {
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".")
    ); // Extract file extension
    const newFileName = `category-${uuidv4()}-${Date.now()}${fileExtension}`;
    // Check if the file is an image
    if (file.mimetype.startsWith("image/")) {
      const filePath = `uploads/categories/${newFileName}`;

      await sharp(file.buffer)
        .toFormat("webp") // Convert to WebP
        .webp({ quality: 97 })
        .toFile(filePath);

      // Update the req.body to include the path for the new image
      req.body.image = filePath;
    } else {
      return next(
        new ApiError(
          "Unsupported file type. Only images are allowed for category.",
          400
        )
      );
    }
  }
  next();
});

//@desc get list of categories
//@route GET /api/v1/categories
//@access public
exports.getCategories = factory.getALl(Category, "Category");
//@desc get specific category by id
//@route GET /api/v1/categories/:id
//@access public
exports.getCategory = factory.getOne(Category);
//@desc create category
//@route POST /api/v1/categories
//@access private
exports.createCategory = factory.createOne(Category);
//@desc update specific category
//@route PUT /api/v1/categories/:id
//@access private
exports.updateCategory = factory.updateOne(Category);

//@desc delete category
//@route DELETE /api/v1/categories/:id
//@access private
exports.deleteCategory = factory.deleteOne(Category);
