const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Category = require("../models/categoryModel");
const factory = require("./handllerFactory");

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

// Function to create a new category directory
exports.createCategoryDir = asyncHandler(async (req, res, next) => {
  if (req.body.title_en) {
    const dirPath = path.join(
      __dirname,
      "uploads",
      "services",
      req.body.title_en
    );
    // Try creating the directory. If it already exists, this does nothing.
    await fs.mkdir(dirPath, { recursive: true });
    console.log("Directory ensured:", dirPath);
  }
  next(); // Proceed with the next operation
});
