const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const BrandService = require("./brand.service");

// Get all brands
const getBrandsController = asyncHandler(async (req, res) => {
  const result = await BrandService.getAllBrandsService();

  res
    .status(200)
    .json(
      apiResponse(
        200,
        result,
        "All brands data fetched successfully"
      )
    );
});

// Create brand
const createBrandController = asyncHandler(async (req, res) => {
  const result = await BrandService.createBrandService(
    req.body,
    req.file
  );

  res
    .status(201)
    .json(
      apiResponse(
        201,
        result,
        "Brand created successfully"
      )
    );
});

// Update brand
const updateBrandController = asyncHandler(async (req, res) => {
  const result = await BrandService.updateBrandService(
    req.resource,
    req.body,
    req.file
  );

  res
    .status(200)
    .json(
      apiResponse(
        200,
        result,
        "Brand updated successfully"
      )
    );
});

// Delete brand
const deleteBrandController = asyncHandler(async (req, res) => {
  const result = await BrandService.deleteBrandService(
    req.resource
  );

  res
    .status(200)
    .json(
      apiResponse(
        200,
        result,
        "Brand deleted successfully"
      )
    );
});

module.exports = {
  getBrandsController,
  createBrandController,
  updateBrandController,
  deleteBrandController,
};