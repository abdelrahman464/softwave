const asyncHandler = require("express-async-handler");
const Request = require("../models/requstModel");
const factory = require("../../../helpers/handllerFactory");
const ApiError = require("../../../utils/apiError");

/*               =====================> BASIC CRUD <=====================                            */
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
exports.getRequsts = factory.getALl(Request, "Request");
//@desc get specific requsts by id
//@route GET /api/v1/requsts/:id
//@access public
exports.getRequst = factory.getOne(Request);
//@desc update request
//@route Post /api/v1/requsts/:id
//@access protected private admin
exports.updateRequst = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  const updatedRequst = await Request.findByIdAndUpdate(requestId, req.body, {
    new: true,
  });
  return res.status(201).json({ status: "success", data: updatedRequst });
});
//@desc delete Service
//@route DELETE /api/v1/requsts/:id
//@access private
exports.deleteRequst = factory.deleteOne(Request);

/*               =====================> ADVANCED Updates WITH SPECIFIC Logic <=====================                            */
//@desc add New Meeting
//@route Post /api/v1/requsts/addNewMeeting/:id
//@access protected private admin
exports.addNewMeeting = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  const updatedRequst = await Request.findByIdAndUpdate(
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
    return next(new ApiError("Request not found", 404));
  }
  return res.status(200).json({ status: "new payment was added successfully" });
});
//@desc addNewBill to request
//@route PUT /api/v1/requsts/addNewBill/:id
//@access protected private admin
exports.addNewBill = asyncHandler(async (req, res, next) => {
  const requestId = req.params.id;
  const updatedRequst = await Request.findByIdAndUpdate(
    requestId,
    {
      $push: {
        bills: {
          cost: req.body.cost,
          description: req.body.description,
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
// update bill to be paid
exports.makeBillPaid = asyncHandler(async (req, res) => {
  const { id } = req.params; //bill_id
  const result = await Request.updateOne(
    { "bills._id": id },
    {
      $set: {
        "bills.$.isPaid": true,
        "bills.$.paidAt": Date.now(),
      },
    }
  );
  if (result.nModified === 0) {
    return res.status(404).json({ msg: "This bill not found" });
  }
  return res.status(200).json({ msg: "bill has been paid successfully " });
});

//get all bills with user and request => in array  [{bill + request + }]
exports.getAllBills = asyncHandler(async (req, res) => {
  const bills = await Request.find({
    bills: { $exists: true, $not: { $size: 0 } },
  }).select("user service bills");

  if (bills.length === 0) {
    return res.status(404).json({ msg: `there are no bills` });
  }

  return res.status(200).json({ data: bills });
});
