const categoryRoute = require("./categoryRoute");
const ServiceRoute = require("./ServiceRoute");
const requestRoute = require("./requestRoute");
const userRoute = require("./userRoute");
const reviewRoute = require("./reviewRoute");
const orderRoute = require("./OrderRoute");
const authRoute = require("./authRoute");
const reqProgressRoute = require("./ReqProgressRoute");
const QuestionRoute = require("./questionRoute");
const sampleRoute = require("./sampleRoute");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/services", ServiceRoute);
  app.use("/api/v1/questions", QuestionRoute);
  app.use("/api/v1/requests", requestRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/reqProgress", reqProgressRoute);
  app.use("/api/v1/samples", sampleRoute);
};
module.exports = mountRoutes;
