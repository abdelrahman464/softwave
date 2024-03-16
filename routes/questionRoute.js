const express = require("express");
const authServices = require("../services/authServices");
// const {
//   createQuestionValidator,
//   idValidator,
//   updateQuestionValidator,
// } = require("../utils/validators/questionValidator");
const {
  createQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionsByService,
} = require("../services/questionService");
const { MongoIdValidator } = require("../utils/public/publicValidator");

const router = express.Router();

router.route("/service/:id").get(MongoIdValidator, getQuestionsByService);
router.route("/").get(getQuestions).post(
  authServices.protect,
  authServices.allowedTo("admin"),
  // createQuestionValidator,
  createQuestion
);
router
  .route("/:id")
  .get(authServices.protect, MongoIdValidator, getQuestion)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator,
    // updateQuestionValidator,
    updateQuestion
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    MongoIdValidator,
    deleteQuestion
  );

module.exports = router;
