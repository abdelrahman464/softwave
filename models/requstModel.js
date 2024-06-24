const mongoose = require("mongoose");

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
    textarea: {
      type: String,
      required: [true, "textarea is required"],
    },
    price: {
      type: Number,
      trim: true,
      max: [200000, "Too long service price"],
    },
    expectedPrice: {
      type: Number,
      trim: true,
      max: [200000, "Too long service price"],
    },
    additionalPayment: [
      {
        description: String,
        price: {
          type: Number,
          required: [true, "additional Payment is required"],
          trim: true,
          max: [200000, "Too long additional Payment"],
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    status: {
      type: String,
      enum: ["completed", "working", "pending"],
      default: "pending",
    },
    projectFile: String,
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
