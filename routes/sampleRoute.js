const express = require("express");

const authServices = require("../services/authServices");
const samplesService = require("../services/samplesService");

const router = express.Router();

router
  .route("/")
  .get(samplesService.getAll)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    samplesService.uploadImages,
    samplesService.resizeImages,
    samplesService.createOne
  );
router
  .route("/:id")
  .get(samplesService.getOne)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    samplesService.uploadImages,
    samplesService.resizeImages,
    samplesService.updateOne
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    samplesService.deleteOne
  );

module.exports = router;
