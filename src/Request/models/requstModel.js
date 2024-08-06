const mongoose = require("mongoose");

//TODO
// 1- make user enter his email name phone manual , or use his account info
const userRequestSchema = mongoose.Schema(
  {
    user: {
      required: [true, "user is required"],
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    service: {
      required: [true, "service is required"],
      type: mongoose.Schema.ObjectId,
      ref: "Service",
    },
    //if user has any additinal notes
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed", "canceled"],
      default: "pending",
    },
    //request file(images,docs,..)
    projectFile: String,
    // request payments
    cost: {
      type: Number,
      trim: true,
    },
    // the answe of user on question of specific service
    questionsAnswers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        answer: {
          type: String,
        },
      },
    ],
    bills: [
      {
        description: String,
        cost: {
          type: Number,
          trim: true,
        },
        isPaid: {
          type: Boolean,
          default: false,
        },
        paymentMethodType: {
          type: String,
          enum: ["manually", "paypal", "stripe"],
        },
        paidAt: Date,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    // the meeting with the user
    meetings: [
      {
        link: String,
        date: Date,
        about: String,
      },
    ],
  },
  { timestamps: true }
);
//!!!!!! pre middleware
userRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email profileImg ",
  })
    .populate({
      path: "service",
      select: "title_en category",
    })
    .populate({
      path: "questionsAnswers.questionId",
      select: "question -_id -service",
    });

  next();
});

// helpers
const setFileURL = (doc) => {
  //return File base url + file name
  if (doc.projectFile) {
    const FileUrl = `${process.env.BASE_URL}/requests/${doc.projectFile}`;
    doc.projectFile = FileUrl;
  }
};
//!!!!! pre middleware
// it work with findOne,findAll,update
userRequestSchema.post("init", (doc) => {
  setFileURL(doc);
});
// it work with create
userRequestSchema.post("save", (doc) => {
  setFileURL(doc);
});
// Create an index on the bills._id field
userRequestSchema.index({ 'bills._id': 1 });

module.exports = mongoose.model("Request", userRequestSchema);
