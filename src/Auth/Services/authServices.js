const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const asyncHandler = require("express-async-handler");
const User = require("../../User/Models/userModel");
const ApiError = require("../../../utils/apiError");
const sendEmail = require("../../../utils/sendEmail");
const generateToken = require("../../../utils/generateToken");

// @desc    User Register,login with Google
// @route   POST /api/v1/auth/google
// @access  Public
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    asyncHandler(async (req, accessToken, refreshToken, profile, done) => {
      // Find a user by google.id or email in the database
      let existingUser = await User.findOne({
        $or: [{ "google.id": profile.id }, { email: profile.emails[0].value }],
      });

      console.log("profile", profile);

      if (existingUser) {
        // Check if the user has logged in with Google before
        if (!existingUser.google || !existingUser.google.id) {
          // The user exists by email but hasn't logged in with Google before, so update the record
          await User.updateOne(
            { _id: existingUser._id }, // filter
            {
              // update
              $set: {
                "google.id": profile.id,
                "google.email": profile.emails[0].value,
                isOAuthUser: true,
              },
            }
          );
          // After update, it's a good idea to refresh the existingUser object if you plan to use it right after
          existingUser = await User.findById(existingUser._id);
        }
        // Generate a JWT for the (possibly updated) existing user
        const token = generateToken(existingUser._id);
        return done(null, { user: existingUser, token }); // Include token in the user object
      }
      // No user exists by Google ID or email, create a new user
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        google: {
          id: profile.id,
          email: profile.emails[0].value,
        },
        isOAuthUser: true,
      });
      const token = generateToken(newUser._id);
      done(null, { user: newUser, token }); // Include token in the user object
    })
  )
);

//@desc signup
//@route POST /api/v1/auth/signup
//@access public
exports.signup = asyncHandler(async (req, res, next) => {
  //1-create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2- generate token
  const token = generateToken(user._id);

  return res.status(201).json({ data: user, token });
});
//@desc login
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  //1- check if password and emaail in the body
  //2- check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect password or email", 401));
  }
  //3- generate token
  const token = generateToken(user._id);
  //3- send response to client side
  res.status(200).json({ data: user, token });
});

//@desc make sure user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1- check if token exists, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login,please login first", 401));
  }
  //2- verify token (no change happens,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3-check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    next(new ApiError("user is not available"));
  }
  //4-check if user changed password after token generated
  if (currentUser.passwordChangedAt) {
    //convert data to timestamp by =>getTime()
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    //it mean password changer after token generated
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "user recently changed his password,please login again",
          401
        )
      );
    }
  }
  //add user to request
  //to use this in authorization
  // check if user is already registered
  req.user = currentUser;

  next();
});
//@desc  Authorization (user permissions)
// ....roles => retrun array for example ["admin","manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles
    //2- access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });
//@desc forgot password
//@route POST /api/v1/auth/forgotPassword
//@access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1-Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new ApiError(`there is no user with email ${req.body.email}`, 404));
  }
  //2-if user exists hash generate random 6 digits and save it in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //save hashed password reset code
  user.passwordResetCode = hashedResetCode;
  //add expiration time  for password reset code (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const emailMessage = `Hi ${user.name},\n we recived a request to reset your password on your E-shop Account. 
  \n ${resetCode} \n enter this code to complete the reset \n thanks for helping us keep your account secure.\n 
  the E-shop Team`;
  //3-send the reset code via email
  try {
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset code (valid for 10 min)",
      text: emailMessage,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(
      new ApiError(
        "there is a problem with sending Email with your reset code",
        500
      )
    );
  }
  res.status(200).json({
    status: "success",
    message: `Reset Code Sent Success To ${user.email}`,
  });
});
//@desc verify reset password code
//@route POST /api/v1/auth/verifyResetCode
//@access public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  //1-get user passed on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    //check if the reset code is valid
    // if reset code expire date greater than Data.now() then reset code is valid
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("reset code invalid or expired"));
  }
  //2- reset code is valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "success" });
});
//@desc  reset password
//@route PUT /api/v1/auth/resetPassword
//@access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1-get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with that email ${req.body.email}`, 404)
    );
  }
  //2- check is reset code is verifyed
  if (!user.passwordResetVerified) {
    return next(new ApiError(`Reset code not verified`, 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  //3- if every thing is okay
  //generate token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});
