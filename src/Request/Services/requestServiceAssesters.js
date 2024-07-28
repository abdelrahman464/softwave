const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const {
  uploadSingleFile,
} = require("../../../middlewares/uploadImageMiddleware");
const ApiError = require("../../../utils/apiError");

//1- upload file
exports.uploadFile = uploadSingleFile("projectFile");
//------------------
//2- resize file
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
//3- convert highlights_ar to array
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
//4- filter requests based on user role
exports.filterRequsts = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});
