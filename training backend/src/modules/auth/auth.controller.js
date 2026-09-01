const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");
const apiResponse = require("../../utils/apiResponse");

const jwt = require("jsonwebtoken");
const apiError = require("../../utils/apiError");

const {
  refreshCookieOptions,
  accessCookieOptions,
  signAccessToken, signRefreshToken,verifyRefreshToken,
} = require("../../utils/token");

const RefreshModel = require("../../models/refreshToken.model");

const generateToken = (res, data) => {
  const accessToken = signAccessToken(data);
  const refreshToken = signRefreshToken(data);

  res.cookie("refreshTokens", refreshToken, refreshCookieOptions);
  res.cookie("accessTokens", accessToken, accessCookieOptions);
  return { accessToken: accessToken, refreshToken: refreshToken };
};

// register controller
const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const userData = await authService.registerService({
    name,
    email,
    password,
    role,
  });

  const tokens = generateToken(res, userData.user);

  await authService.createRefreshService({
    userId: userData.user._id,
    token: tokens.refreshToken,
  });

  res.status(201).json(
    apiResponse(
      201,
      {
        user: userData.user,
        tokens,
      },
      "User created successfully!",
    ),
  );
});

//login controller
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body :", req.body);
  const result = await authService.loginService({ email, password });

  const tokens = generateToken(res, result.user);

  await authService.createRefreshService({
    userId: result.user._id,
    token: tokens.refreshToken,
  });

  res
    .status(200)
    .json(
      apiResponse(200, { user: result.user, tokens }, "login successfully!!"),
    );
});

//refresh cpntroller
const refreshController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshTokens;

  if (!refreshToken) {
    throw apiError(401, "Refresh token not found!");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await authService.getUserById(decoded.sub);

  if (!user) {
    throw apiError(404, "User not found!");
  }

  const tokens = generateToken(res, user);

  await authService.createRefreshService({
    userId: user._id,
    token: tokens.refreshToken,
  });

  res
    .status(200)
    .json(
      apiResponse(
        200,
        null,
        "Token refreshed successfully!"
      )
    );
});

//logout controller
const logoutController = asyncHandler(async (req, res) => {
  // 1. Get refresh token from cookie
  const refreshToken = req.cookies.refreshTokens;

  // 2. Delete refresh token from DB
  if (refreshToken) {
    await authService.logoutService(refreshToken);
  }

  // 3. Clear cookies
  res.clearCookie("refreshTokens", refreshCookieOptions);
  res.clearCookie("accessTokens", accessCookieOptions);

  res.status(200).json(apiResponse(200, null, "Logout successfully!"));
});



//change password controller
const changePasswordController = asyncHandler(async (req, res) => {
   const {oldPassword,newPassword}= req.body;
  await authService.changePasswordService({userID: req.user.sub, newPassword:newPassword,oldPassword:oldPassword});

  res.status(200).json(apiResponse(200,null,"password changed successfully!"))
});

const authController = {
  registerController,
  loginController,
  logoutController,
  changePasswordController,
  refreshController,
};
module.exports = { authController };
