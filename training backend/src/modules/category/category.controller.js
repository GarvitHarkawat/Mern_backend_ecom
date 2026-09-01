const asyncHandler = require("../../utils/asyncHandler");
const Category = require("../../models/category.model");
const categoryService = require("./category.service");
const apiResponse = require("../../utils/apiResponse");

const getAllCategoryController = asyncHandler(async (req, res) => {
  const categoryData = await categoryService.getAllCategoryService();
  res
    .status(200)
    .json(apiResponse(200, categoryData, "Data delivered successfully!"));
});

const createCategoryController = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    parent: req.params.id || req.body.parent || null,
  };

  const file = req.file;

  const result = await categoryService.createCategoryService(data, file);

  res
    .status(201)
    .json(apiResponse(201, result, "category created successfully!"));
});

const updateCategoryController = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategoryService(
      req.resource,
      req.body,
      req.file,
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategoryController = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategoryService(req.resource);

  res
    .status(200)
    .json(apiResponse(200, result, "Category deleted successfully!"));
});

const getAllTreeCategoryController = asyncHandler(async (req, res) => {
  const categoryData = await categoryService.getAllTreeCategoryService();

  res
    .status(200)
    .json(
      apiResponse(200, categoryData, "Category tree delivered successfully!"),
    );
});

module.exports = {
  getAllCategoryController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getAllTreeCategoryController,
};
