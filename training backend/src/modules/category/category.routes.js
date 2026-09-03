const express = require("express");

const categoryRouter = express.Router();

const categoryController = require("./category.controller");

const { upload } = require("../../middlewares/upload.middleware");

const loadResource = require("../../middlewares/losdResource.middleware");

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
  validate(createCategoryValidator),
  upload.single("image"),
  categoryController.createCategoryController,
);

// Create child category
categoryRouter.post(
  "/:id",
  validate(createCategoryValidator),
  upload.single("image"),
  categoryController.createCategoryController,
);

// Update category
categoryRouter.patch(
  "/:id",
  loadResource(Category),
  validate(updateCategoryValidator),
  upload.single("image"),
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