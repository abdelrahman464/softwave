const express = require("express");
//id validator
const { MongoIdValidator } = require("../../../utils/public/publicValidator");

// const {
//   getCategoryValidator,
//   createCategroyValidator,
//   updateCategroyValidator,
//   deleteCategroyValidator,
// } = require("../utils/validators/categoryValidator");
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAllRequestProgress,
} = require("../Services/reqProgressService");

const authServices = require("../../Auth/Services/authServices");

const router = express.Router();

router.get(
  "/request/:id",
  authServices.protect,
  MongoIdValidator(),
  getAllRequestProgress
);
router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("admin"), getAll)
  .post(authServices.protect, authServices.allowedTo("admin"), createOne);
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator(),
    getOne
  )
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator(),
    updateOne
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator(),
    deleteOne
  );

module.exports = router;
