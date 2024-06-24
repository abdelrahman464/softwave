const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleFile } = require("../middlewares/uploadImageMiddleware");
const Requst = require("../models/requstModel");
const factory = require("./handllerFactory");
const ApiError = require("../utils/apiError");

exports.uploadFile = uploadSingleFile("projectFile");

exports.resizeFile = asyncHandler(async (req, res, next) => {
  const { file } = req; // Access the uploaded file
  if (file) {
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".")
    ); // Extract file extension
    const newFileName = `projectFile-${uuidv4()}-${Date.now()}${fileExtension}`; // Generate new file name

    // Check for PDF or Word document based on MIME type
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Save the file directly
      fs.writeFileSync(`uploads/requests/${newFileName}`, file.buffer);
    } else {
      return next(
        new ApiError(
          "Unsupported file type. Only PDF and Word documents are allowed.",
          400
        )
      );
    }

    // Save the new file name in the request body for further processing
    req.body.projectFile = newFileName;
  }
  next();
});

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

// if role user check if user is the owner of the request
exports.AuthorityRequst = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    const requst = await Requst.findById(req.params.id);
    if (requst.user._id.toString() !== req.user._id.toString()) {
      return next(new ApiError(`you are not the owner of this request`, 401));
    }
  }
  next();
});
//@desc send Requst
//@route Post /api/v1/requsts
//@access protected public
exports.createRequst = asyncHandler(async (req, res, next) => {
  const { service, textarea, projectFile, questionsAnswers } = req.body;
  const newRequst = await Requst.create({
    user: req.user._id,
    service,
    projectFile,
    questionsAnswers: questionsAnswers,
    textarea,
  });
  res.status(201).json({ status: "success", data: newRequst });
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
  res.status(201).json({ status: "success", data: updatedRequst });
});
//@desc update request
//@route Post /api/v1/requsts/:id
//@access protected private admin
exports.updateRequst = asyncHandler(async (req, res, next) => {
  const { textarea, projectFile, expectedPrice } = req.body;
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(
    requestId,
    { textarea, projectFile, expectedPrice },
    { new: true }
  );
  res.status(201).json({ status: "success", data: updatedRequst });
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
  res.status(201).json({ status: "success", data: requst });
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
