const express = require("express");

const BrandRouter = express.Router();

const BrandController = require("./brand.controller");

const { upload } = require("../../middlewares/upload.middleware");

const loadResource = require("../../middlewares/loadResource.middleware");

const BrandModel = require("../../models/brand.model");
const validate = require("../../middlewares/validate.middleware");
const {
  createBrandValidator,
  updateBrandValidator,
} = require("./brand.validator");



// Get all brands - Public
BrandRouter.get("/", BrandController.getBrandsController);

// Create brand
BrandRouter.post(
  "/",
  validate(createBrandValidator),
  upload.single("logo"),
  BrandController.createBrandController,
);

// Update brand
BrandRouter.patch(
  "/:id",
  loadResource(BrandModel),
  validate(updateBrandValidator),
  upload.single("logo"),
  BrandController.updateBrandController,
);

// Delete brand
BrandRouter.delete(
  "/:id",
  loadResource(BrandModel),
  BrandController.deleteBrandController,
);

module.exports = BrandRouter;