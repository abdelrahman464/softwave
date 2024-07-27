const express = require("express");
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../Validation/reviewValidator");

const {
  createFilterObj,
  setServiceIdAndUserIdToBody,
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require("../Services/reviewService");

const authServices = require("../../Auth/Services/authServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    setServiceIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
