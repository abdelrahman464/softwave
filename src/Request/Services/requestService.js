const asyncHandler = require("express-async-handler");
const Requst = require("../models/requstModel");
const factory = require("../../../helpers/handllerFactory");
const ApiError = require("../../../utils/apiError");

//@desc send Requst
//@route Post /api/v1/requsts
//@access protected public
exports.createRequst = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  const newRequst = await Requst.create(req.body);
  return res.status(201).json({ status: "success", data: newRequst });
});
//@desc get list of requsts
//@route GET /api/v1/requsts
//@access public
exports.getRequsts = factory.getALl(Requst, "Request");
//@desc get specific requsts by id
//@route GET /api/v1/requsts/:id
//@access public
exports.getRequst = factory.getOne(Requst);
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
//@desc add New Meeting
//@route Post /api/v1/requsts/addNewMeeting/:id
//@access protected private admin
exports.addNewMeeting = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(
    requestId,
    {
      $push: {
        meetings: {
          link: req.body.link,
          date: req.body.date,
          about: req.body.about,
        },
      },
    },
    {
      new: true,
    }
  );
  if (!updatedRequst) {
    return next(new ApiError("Requst not found", 404));
  }
  return res.status(200).json({ status: "new payment was added successfully" });
});
//@desc addNewBill to request
//@route PUT /api/v1/requsts/addNewBill/:id
//@access protected private admin
exports.addNewBill = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(
    requestId,
    {
      $push: {
        additionalBills: {
          description: req.body.description,
          price: req.body.price,
        },
      },
    },
    {
      new: true,
    }
  );
  if (!updatedRequst) {
    return next(new ApiError("Requst not found", 404));
  }
  return res.status(200).json({ status: "new payment was added successfully" });
});
//@desc delete Service
//@route DELETE /api/v1/requsts/:id
//@access private
exports.deleteRequst = factory.deleteOne(Requst);
