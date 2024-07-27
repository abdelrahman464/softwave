const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const {
  uploadMixOfFiles,
} = require("../../../middlewares/uploadImageMiddleware");
const Sample = require("../models/samplesModel");
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
    req.files &&
    req.files.imageCover &&
    req.files.imageCover[0].mimetype.startsWith("image/")
  ) {
    const imageCoverFileName = `samples-${uuidv4()}-${Date.now()}-cover.webp`;

    await sharp(req.files.imageCover[0].buffer)
      .toFormat("webp") // Convert to WebP
      .webp({ quality: 95 })
      .toFile(`uploads/samples/${imageCoverFileName}`);

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

      const imageName = `samples-${uuidv4()}-${Date.now()}-${index + 1}.webp`;

      await sharp(img.buffer)
        .toFormat("webp") // Convert to WebP
        .webp({ quality: 95 })
        .toFile(`uploads/samples/${imageName}`);

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

//@desc get list of samples
//@route GET /api/v1/samples
//@access public
exports.getAll = factory.getALl(Sample, "Sample");
//@desc get specific sample by id
//@route GET /api/v1/samples/:id
//@access public
exports.getOne = factory.getOne(Sample);
//@desc create sample
//@route POST /api/v1/samples
//@access private
exports.createOne = factory.createOne(Sample);
//@desc update specific sample
//@route PUT /api/v1/samples/:id
//@access private
exports.updateOne = factory.updateOne(Sample);
//@desc delete sample
//@route DELETE /api/v1/samples/:id
//@access private
exports.deleteOne = factory.deleteOne(Sample);
