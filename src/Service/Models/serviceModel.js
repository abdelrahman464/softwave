const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    //related to
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "service category is required"],
    },
    // text infoes
    title_ar: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short service title"],
      maxlength: [100, "too Shot service title"],
    },
    title_en: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short service title"],
      maxlength: [100, "too Shot service title"],
    },
    slug_ar: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug_en: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description_ar: {
      type: String,
      required: [true, "service description is required"],
      trim: true,
      minlength: [20, "Too short service description"],
    },
    description_en: {
      type: String,
      required: [true, "service description is required"],
      trim: true,
      minlength: [20, "Too short service description"],
    },

    highlights_ar: [String],
    highlights_en: [String],
    //service price
    price: {
      type: Number,
    },
    //service files(images)
    imageCover: {
      type: String,
      required: [true, "service image cover is required"],
    },
    images: [String],
    //price
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be between 1.0 and 5.0"],
      max: [5, "rating must be between 1.0 and 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timeseries: true,
    // to enable vitual population
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual field =>reviews
serviceSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "service",
  localField: "_id",
});
// virtual field =>samples
serviceSchema.virtual("samples", {
  ref: "Sample",
  foreignField: "service",
  localField: "_id",
});

// ^find => it mean if part of of teh word contains find
serviceSchema.pre(/^find/, function (next) {
  // this => query

  this.populate({
    path: "category",
    select: "title_ar title_en ",
  });

  next();
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/services/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageListWithUrl = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/services/${image}`;
      imageListWithUrl.push(imageUrl);
    });
    doc.images = imageListWithUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
serviceSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
serviceSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Service", serviceSchema);
