const express = require("express");
const sampleValidator = require("../Validation/sampleValidator");
const authServices = require("../../Auth/Services/authServices");
const samplesService = require("../Services/samplesService");

const router = express.Router();

router
  .route("/")
  .get(samplesService.getAll)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    samplesService.uploadImages,
    samplesService.resizeImages,
    sampleValidator.createSampleValidator,
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
    sampleValidator.updateSampleValidator,
    samplesService.updateOne
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    samplesService.deleteOne
  );

module.exports = router;
