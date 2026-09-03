const express = require("express");
const CartRouter = express.Router();
const authMiddleware = require("../../middlewares/authenticate.middleware");

CartRouter.use(authMiddleware);

module.exports = CartRouter;