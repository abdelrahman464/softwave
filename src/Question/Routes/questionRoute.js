const express = require("express");
const authServices = require("../../Auth/Services/authServices");

const {
  createQuestion,
  getQuestion,
  createFilterObj,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../Services/questionService");
const { MongoIdValidator } = require("../../../utils/public/publicValidator");

const router = express.Router();

router
  .route("/service/:serviceId")
  .get(MongoIdValidator("serviceId"), createFilterObj, getQuestions);

router
  .route("/")
  .get(getQuestions)
  .post(authServices.protect, authServices.allowedTo("admin"), createQuestion);
router
  .route("/:id")
  .get(authServices.protect, MongoIdValidator(), getQuestion)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator(),
    updateQuestion
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator(),
    deleteQuestion
  );

module.exports = router;
