const express = require("express");
const authServices = require("../../Auth/Services/authServices");
const {
  findSpecificOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  checkoutSession,
} = require("../Services/OrderService");

const router = express.Router();

router.use(authServices.protect);

router.get(
  "/checkout-session/:requstId",
  authServices.allowedTo("user"),
  checkoutSession
);

router
  .route("/")
  .get(
    authServices.allowedTo("user", "admin"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authServices.allowedTo("admin"), findSpecificOrder);

module.exports = router;
