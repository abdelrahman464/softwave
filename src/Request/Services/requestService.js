const asyncHandler = require("express-async-handler");
const Requst = require("../models/requstModel");
const factory = require("../../../helpers/handllerFactory");

exports.convertToArray = (req, res, next) => {
  if (req.body.highlights_ar) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_ar)) {
      req.body.highlights_ar = [req.body.highlights_ar];
    }
  }
  if (req.body.highlights_en) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_en)) {
      req.body.highlights_en = [req.body.highlights_en];
    }
  }

  next();
};
exports.filterRequsts = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});
//@desc send Requst
//@route Post /api/v1/requsts
//@access protected public
exports.createRequst = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  const newRequst = await Requst.create(req.body);
  return res.status(201).json({ status: "success", data: newRequst });
});
//@desc update request status
//@route Post /api/v1/requsts/:id/status
//@access protected private admin
exports.updateRequstStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );
  return res.status(201).json({ status: "success", data: updatedRequst });
});
//@desc update request
//@route Post /api/v1/requsts/:id
//@access protected private admin
exports.updateRequst = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(requestId, req.body, {
    new: true,
  });
  return res.status(201).json({ status: "success", data: updatedRequst });
});
//@desc update request
//@route PUT /api/v1/requsts/:id/setprice
//@access protected private admin
exports.setRequstPriceByAdmin = asyncHandler(async (req, res, next) => {
  const { price } = req.body;
  const requestId = req.params.id;
  const requst = await Requst.findByIdAndUpdate(
    requestId,
    { price },
    { new: true }
  );
  return res.status(201).json({ status: "success", data: requst });
});
//@desc get list of requsts
//@route GET /api/v1/requsts
//@access public
exports.getRequsts = factory.getALl(Requst, "Request");
//@desc get specific requsts by id
//@route GET /api/v1/requsts/:id
//@access public
exports.getRequst = factory.getOne(Requst);
//@desc delete Service
//@route DELETE /api/v1/requsts/:id
//@access private
exports.deleteRequst = factory.deleteOne(Requst);
