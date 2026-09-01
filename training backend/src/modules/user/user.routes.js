const express = require("express");

const userRouter = express.Router();

const userController = require("./user.controller");
const authMiddleware = require("../../middlewares/authenticate.middleware");
const {upload} = require("../../middlewares/upload.middleware");

//===========User Api =======================

// get own profile
userRouter.get("/me", authMiddleware, userController.getOwnProfileController);

//update own profile
userRouter.patch(
  "/me",
  authMiddleware,
  upload.single("profilePicture"),
  userController.updateOwnProfileController
);

//get all address
userRouter.get(
  "/me/addresses",
  authMiddleware,
  userController.getAllAddressesController
);

//create addresses
userRouter.post(
  "/me/addresses",
  authMiddleware,
  userController.createAddressesController
);

//update address
userRouter.patch(
  "/me/addresses/:addrId",
  authMiddleware,
  userController.updateAddressesController
);

//delete address
userRouter.delete(
  "/me/addresses/:addrId",
  authMiddleware,
  userController.deleteAddressesController
);

//======Admin api ===============

//update user status
userRouter.patch(
  "/:id/status",
  authMiddleware,
  userController.updateUserStatusController
);

//delete user
userRouter.delete(
    "/:id", 
    authMiddleware,
    userController.deleteUserController
);
//get all users
userRouter.get(
    "/",
     authMiddleware, 
     userController.getAllUserController
    );

module.exports = userRouter;
