const express = require("express");

const BrandRouter = express.Router();

const BrandController = require("./brand.controller");

const { upload } = require("../../middlewares/upload.middleware");

const loadResource = require("../../middlewares/losdResource.middleware");

const BrandModel = require("../../models/brand.model");

// const {
//   createBrandValidator,
//   updateBrandValidator,
// } = require("./brand.validator");

// Get all brands - Public
BrandRouter.get("/", BrandController.getBrandsController);

// Create brand
BrandRouter.post(
  "/",

  upload.single("logo"),
  BrandController.createBrandController,
);

// Update brand
BrandRouter.patch(
  "/:id",
  loadResource(BrandModel),

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
