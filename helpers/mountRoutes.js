const categoryRoute = require("../src/Category/Routes/categoryRoute");
const serviceRoute = require("../src/Service/Routes/serviceRoute");
const requestRoute = require("../src/Request/Routes/requestRoute");
const userRoute = require("../src/User/Routes/userRoute");
const reviewRoute = require("../src/Review/Routes/reviewRoute");
const orderRoute = require("../src/Order/Routes/OrderRoute");
const authRoute = require("../src/Auth/Routes/authRoute");
const reqProgressRoute = require("../src/RequestProgress/Routes/ReqProgressRoute");
const QuestionRoute = require("../src/Question/Routes/questionRoute");
const sampleRoute = require("../src/Samples/Routes/sampleRoute");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/services", serviceRoute);
  app.use("/api/v1/questions", QuestionRoute);
  app.use("/api/v1/requests", requestRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/reqProgress", reqProgressRoute);
  app.use("/api/v1/samples", sampleRoute);
};
module.exports = mountRoutes;
