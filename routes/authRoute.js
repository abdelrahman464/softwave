const express = require("express");


const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authServices");


const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator,login);
//send email to user to reset password 
router.route("/forgotPassword").post(forgotPassword);
//verify the code sent to the user
router.route("/verifyResetCode").post(verifyPassResetCode);
//reset the password
router.route("/resetPassword").put(resetPassword);


module.exports = router;
