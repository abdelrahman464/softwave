const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const {
  uploadMixOfFiles,
} = require("../../../middlewares/uploadImageMiddleware");
const Service = require("../Models/serviceModel");
const factory = require("../../../helpers/handllerFactory");
const ApiError = require("../../../utils/apiError");

exports.uploadImages = uploadMixOfFiles([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
]);

exports.resizeImages = asyncHandler(async (req, res, next) => {
  // Image processing for imageCover
  if (
    req.files.imageCover &&
    req.files.imageCover[0].mimetype.startsWith("image/")
  ) {
    const imageCoverFileName = `service-${uuidv4()}-${Date.now()}-cover.webp`;

    await sharp(req.files.imageCover[0].buffer)
      .toFormat("webp") // Convert to WebP
      .webp({ quality: 95 })
      .toFile(`uploads/services/${imageCoverFileName}`);

    // Save imageCover file name in the request body for database saving
    req.body.imageCover = imageCoverFileName;
  } else if (req.files.imageCover) {
    return next(new ApiError("Image cover is not an image file", 400));
  }

  // Image processing for images
  if (req.files.images) {
    const imageProcessingPromises = req.files.images.map(async (img, index) => {
      if (!img.mimetype.startsWith("image/")) {
        throw new ApiError(`File ${index + 1} is not an image file.`, 400);
      }

      const imageName = `service-${uuidv4()}-${Date.now()}-${index + 1}.webp`;

      await sharp(img.buffer)
        .toFormat("webp") // Convert to WebP
        .webp({ quality: 95 })
        .toFile(`uploads/services/${imageName}`);

      return imageName;
    });

    try {
      const processedImages = await Promise.all(imageProcessingPromises);
      req.body.images = processedImages;
    } catch (error) {
      return next(error);
    }
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

//@desc get list of Services
//@route GET /api/v1/services
//@access public
exports.getServices = factory.getALl(Service, "Service", {
  samples: "title_ar title_en -service", // if you want to select all fields => samples:null
});
//@desc get specific Service by id
//@route GET /api/v1/services/:id
//@access public
exports.getService = factory.getOne(Service, "reviews");
//@desc create Service
//@route POST /api/v1/service
//@access private
exports.createService = factory.createOne(Service);
//@desc update specific Service
//@route PUT /api/v1/services/:id
//@access private
exports.updateService = factory.updateOne(Service);

//@desc delete Service
//@route DELETE /api/v1/services/:id
//@access private
exports.deleteService = factory.deleteOne(Service);
