
const express = require("express");

const authRouter = express.Router();

const { authController } = require("./auth.controller");

const validate = require("../../middlewares/validate.middleware");



const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("./auth.validator");

const authMiddleware = require("../../middlewares/authenticate.middleware");

// Register
authRouter.post(
  "/register",
  validate(registerSchema),
  authController.registerController
);

// Login
authRouter.post(
  "/login",
  validate(loginSchema),
  authController.loginController
);

// Refresh
authRouter.post(
  "/refresh",
  authController.refreshController
);

// Logout
authRouter.post(
  "/logout",
  authController.logoutController
);


// Change Password
authRouter.post(
  "/changePassword",
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePasswordController
);

module.exports = authRouter; 