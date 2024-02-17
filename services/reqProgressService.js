const factory = require("./handllerFactory");
const RequestProgress = require("../models/reqProgressModel");

//@desc get all docs
//@route GET /api/v1/RquestProgress
//@access private
exports.getAll = factory.getALl(RequestProgress);
//@desc get RequestProgress  by id
//@route GET /api/v1/RquestProgress/:id
//@access private
exports.getOne = factory.getOne(RequestProgress);
//@desc create new step (doc) for a request
//@route POST /api/v1/RequestProgress
//@access private
exports.createOne = factory.createOne(RequestProgress);
//@desc update RequestProgress by id
//@route PATCH /api/v1/RequestProgress/:id
//@access private
exports.updateOne = factory.updateOne(RequestProgress);
//@desc delete RequestProgress by id
//@route DELETE /api/v1/RequestProgress/:id
//@access private
exports.deleteOne = factory.deleteOne(RequestProgress);
//@desc get all docs for a specific request
//@route GET /api/v1/RquestProgress/request/:requestId
//@access private
exports.getAllRequestProgress = async (req, res, next) => {
  try {
    const requestProgress = await RequestProgress.find({
      request: req.params.id,
    });
    if (requestProgress.length === 0) {
      return res.status(404).json({
        status: "faild",
        message: "project is not in progress yet!",
      });
    }
    return res.status(200).json({
      status: "success",
      data: requestProgress,
    });
  } catch (error) {
    next(error);
  }
};
