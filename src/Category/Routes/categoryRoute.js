const express = require("express");

const {
  getCategoryValidator,
  createCategroyValidator,
  updateCategroyValidator,
  deleteCategroyValidator,
} = require("../Validation/categoryValidator");
const {
  uploadCategoryImage,
  resizeCategoryImage,
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../Services/categoryService");

const authServices = require("../../Auth/Services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategroyValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategroyValidator,
    updateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteCategroyValidator,
    deleteCategory
  );

module.exports = router;
