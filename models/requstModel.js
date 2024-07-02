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
    price: {
      type: Number,
      trim: true,
    },
    additionalPayment: [
      {
        description: String,
        price: {
          type: Number,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
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
    // the meeting with the user
    meeting: [
      {
        link: String,
        date: Date,
        about: String,
      },
    ],
  },
  { timestamps: true }
);

userRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email profileImg ",
  }).populate({
    path: "service",
    select: "title_en category",
  });

  next();
});
const setFileURL = (doc) => {
  //return File base url + file name
  if (doc.projectFile) {
    const FileUrl = `${process.env.BASE_URL}/requests/${doc.projectFile}`;
    doc.projectFile = FileUrl;
  }
};

// it work with findOne,findAll,update
userRequestSchema.post("init", (doc) => {
  setFileURL(doc);
});
// it work with create
userRequestSchema.post("save", (doc) => {
  setFileURL(doc);
});
module.exports = mongoose.model("Request", userRequestSchema);
