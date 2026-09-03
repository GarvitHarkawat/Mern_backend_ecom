const express = require("express");
const CartRouter = express.Router;
const ValidationMiddleware = require("../../middlewares/authenticate.middleware");


CartRouter.arguments(ValidationMiddleware);

CartRouter.get('/', cartController.get);
CartRouter.post('/', cartController.add);
CartRouter.patch('/', cartController.get);
CartRouter.get('/', cartController.get);