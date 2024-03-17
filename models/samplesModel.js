const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short sample title"],
      maxlength: [100, "too Shot sample title"],
    },
    description_ar: {
      type: String,
      required: [true, "sample description is required"],
      trim: true,
      minlength: [20, "Too short sample description"],
    },
    description_en: {
      type: String,
      required: [true, "sample description is required"],
      trim: true,
      minlength: [20, "Too short sample description"],
    },
    imageCover: {
      type: String,
      required: [true, "service image cover is required"],
    },
    images: [String],
    link: String,
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: [true, "service is required"],
    },
  },
  {
    timeseries: true,
  }
);

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/samples/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageListWithUrl = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/samples/${image}`;
      imageListWithUrl.push(imageUrl);
    });
    doc.images = imageListWithUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
sampleSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
sampleSchema.post("save", (doc) => {
  setImageURL(doc);
});
module.exports = mongoose.model("Sample", sampleSchema);
