const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handllerFactory");

const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Request = require("../models/requstModel");
const Service = require("../models/serviceModel");

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
//@desc get all orders
//@route GET /api/v1/orders
//@access protected/user-admin
exports.findAllOrders = factory.getALl(Order);
//@desc get specifi orders
//@route GET /api/v1/orders/:orderId
//@access protected/user-admin
exports.findSpecificOrder = factory.getOne(Order);

//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;

  const request = await Request.findById(requestId);
  if (!request) {
    return next(new ApiError(` Request Not Found`, 404));
  }
  const servicePrice = request.price;
  const totalOrderPrice = Math.ceil(servicePrice);
  //create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: "usd",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    customer_email: req.user.email,

    client_reference_id: req.params.requestId, // i will use to create order
  });

  // send session to response
  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const requestId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;

  const user = await User.findOne({ email: session.customer_email });

  //create order with default payment method cash
  const order = await Order.create({
    user: user._id,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "stripe",
  });
  // after creating order    find current request and increment related service sold by one
  if (order) {
    const cuurentRequest = await Request.findById(requestId);
    await Service.findByIdAndUpdate(cuurentRequest.service, {
      $inc: { sold: 1 },
    });
  }
};

//@desc this webhook will run when the stripe payment success paied
//@route POST /webhook-checkout
//@access protected/user
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});
