const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  changeLoggedUserPasswordValidator,
} = require("../utils/validators/userValidator");
const authServices = require("../services/authServices");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deactiveMyAcc,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  activeLoggedUser,
  uploadProfileImage,
  resizeImage,
} = require("../services/userService");

const router = express.Router();

router.get("/getMe", authServices.protect, getLoggedUserData, getUser); //uesd
router.delete("/deactiveMyAcc", authServices.protect, deactiveMyAcc); //used
router.put("/activeMe", authServices.protect, activeLoggedUser); //used
router.put(
  "/changeMyPassword",
  authServices.protect,
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword
); //used
router.put(
  "/changeMyData",
  authServices.protect,
  uploadProfileImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
); //used
router.put(
  "/changePassword/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    getUsers
  )
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadProfileImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadProfileImage,
    resizeImage,
    updateUserValidator,
    updateUser
  );

module.exports = router;
