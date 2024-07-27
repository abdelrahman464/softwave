const express = require("express");

const authServices = require("../../Auth/Services/authServices");
const {
  setReqeustPriceValidator,
} = require("../Validation/requestValidator");
const {
  uploadFile,
  resizeFile,
  AuthorityRequst,
  updateRequstStatus,
  getRequsts,
  getRequst,
  createRequst,
  deleteRequst,
  updateRequst,
  setRequstPriceByAdmin,
} = require("../Services/requestService");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("admin"), getRequsts)
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    uploadFile,
    resizeFile,
    createRequst
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "user"),
    AuthorityRequst,
    getRequst
  )
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    uploadFile,
    resizeFile,
    AuthorityRequst,
    updateRequst
  )
  .delete(authServices.protect, authServices.allowedTo("admin","user"),AuthorityRequst, deleteRequst);
router
  .route("/:id/status")
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    updateRequstStatus
  );
router
  .route("/:id/setprice")
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    setReqeustPriceValidator,
    setRequstPriceByAdmin
  );
  
module.exports = router;
