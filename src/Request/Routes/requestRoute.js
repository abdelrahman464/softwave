const express = require("express");

const authServices = require("../../Auth/Services/authServices");
const {
  createValidatior,
  updateValidatior,
  addMeetingValidatior,
  addBillValidatior,
  requstAuthority,
} = require("../Validation/requestValidator");
const {
  getRequsts,
  getRequst,
  createRequst,
  deleteRequst,
  updateRequst,
  addNewBill,
  addNewMeeting,
  makeBillPaid,
  getAllBills,
} = require("../Services/requestService");
const {
  uploadFile,
  resizeFile,
  filterRequsts,
} = require("../Services/requestServiceAssesters");

const router = express.Router();

router.get(
  "/getAllBills",
  authServices.protect,
  authServices.allowedTo("admin"),
  getAllBills
);

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
    authServices.allowedTo("user", "admin"),
    requstAuthority,
    updateValidatior,
    updateRequst
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "user"),
    requstAuthority,
    deleteRequst
  );
router.put(
  "/addNewBill/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  addBillValidatior,
  addNewBill
);
router.put(
  "/addNewMeeting/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  addMeetingValidatior,
  addNewMeeting
);
router.put(
  "/payBill/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  makeBillPaid
);

module.exports = router;
