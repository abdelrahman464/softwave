const express = require("express");
const {
  getServiceValidator,
  createServiceValidator,
  updateServiceValidator,
  deleteServiceValidator,
} = require("../utils/validators/serviceValidator");
const authServices = require("../services/authServices");
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  uploadImages,
  resizeImages,
  convertToArray,
} = require("../services/serviceService");

// nested routes
const reviewsRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:serviceId/reviews", reviewsRoute);

router
  .route("/")
  .get(getServices)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadImages,
    resizeImages,
    convertToArray,
    createServiceValidator,
    createService
  );
router
  .route("/:id")
  .get(getServiceValidator, getService)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadImages,
    resizeImages,
    convertToArray,
    updateServiceValidator,
    updateService
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteServiceValidator,
    deleteService
  );

module.exports = router;
