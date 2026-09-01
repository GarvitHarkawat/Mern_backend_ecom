const express = require("express");

const categoryRouter = express.Router();

const categoryController = require("./category.controller");

const { upload } = require("../../middlewares/upload.middleware");

const loadResource = require("../../middlewares/loadResource.middleware");

const Category = require("../../models/category.model");

const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("./category.validator");

const validate = require("../../middlewares/validate.middleware");

// Get category tree
categoryRouter.get("/tree", categoryController.getAllTreeCategoryController);

// Create root category
categoryRouter.post(
  "/",
  upload.single("image"),
  validate(createCategoryValidator),
  categoryController.createCategoryController,
);

// Create child category
categoryRouter.post(
  "/:id",
  upload.single("image"),
  validate(createCategoryValidator),
  categoryController.createCategoryController,
);

// Update category
categoryRouter.patch(
  "/:id",
  loadResource(Category),
  upload.single("image"),
  validate(updateCategoryValidator),
  categoryController.updateCategoryController,
);

// Delete category
categoryRouter.delete(
  "/:id",
  loadResource(Category),
  categoryController.deleteCategoryController,
);

// Get all categories
categoryRouter.get("/", categoryController.getAllCategoryController);

module.exports = categoryRouter;
