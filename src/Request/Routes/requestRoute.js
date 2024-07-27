const express = require("express");

const authServices = require("../../Auth/Services/authServices");
const {
  setReqeustPriceValidator,
  requstAuthority,
} = require("../Validation/requestValidator");
const {
  filterRequsts,
  updateRequstStatus,
  getRequsts,
  getRequst,
  createRequst,
  deleteRequst,
  updateRequst,
  setRequstPriceByAdmin,
} = require("../Services/requestService");
const { uploadFile, resizeFile } = require("../Services/requestMediaService");

const router = express.Router();

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    filterRequsts,
    getRequsts
  )
  .post(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    uploadFile,
    resizeFile,
    createRequst
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "user"),
    requstAuthority,
    getRequst
  )
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    uploadFile,
    resizeFile,
    requstAuthority,
    updateRequst
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "user"),
    requstAuthority,
    deleteRequst
  );
// router
//   .route("/:id/status")
//   .put(
//     authServices.protect,
//     authServices.allowedTo("admin"),
//     updateRequstStatus
//   );
// router
//   .route("/:id/setprice")
//   .put(
//     authServices.protect,
//     authServices.allowedTo("admin"),
//     setReqeustPriceValidator,
//     setRequstPriceByAdmin
//   );

module.exports = router;
