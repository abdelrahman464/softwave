const express = require("express");

const {
  getCategoryValidator,
  createCategroyValidator,
  updateCategroyValidator,
  deleteCategroyValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  // createCategoryDir,
} = require("../services/categoryService");

const authServices = require("../services/authServices");

const router = express.Router();

router.route("/").get(getCategories).post(
  authServices.protect,
  authServices.allowedTo("admin"),
  createCategroyValidator,
  // createCategoryDir,
  createCategory
);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    updateCategroyValidator,
    // createCategoryDir,
    updateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteCategroyValidator,
    deleteCategory
  );

module.exports = router;
