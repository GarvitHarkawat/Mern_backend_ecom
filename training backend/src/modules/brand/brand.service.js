const BrandModel = require("../../models/brand.model");
const apiError = require("../../utils/apiError");
const convertToSlug = require("../../utils/slug");
const {
  uploadToCloudinary,
  destroyFromCloudinary,
} = require("../../utils/upploadToCloudinary");

// Get all active brands
const getAllBrandsService = async () => {
  const allBrandsData = await BrandModel.find({
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

  return allBrandsData;
};

// Create brand
const createBrandService = async (payload, file) => {
  const slug = convertToSlug(payload.name);

  const isExist = await BrandModel.findOne({
    slug,
  });

  if (isExist) {
    throw apiError(409, "Brand already exists");
  }

  payload.slug = slug;

  if (file) {
    const image = await uploadToCloudinary(
      file.buffer,
      "ecom/brand"
    );

    payload.logo = image;
  }

  const result = await BrandModel.create(payload);

  return result;
};

// Update brand
const updateBrandService = async (brand, payload, file) => {
  if (!brand) {
    throw apiError(404, "Brand not found");
  }

  // Update name and generate new slug
  if (payload.name !== undefined) {
    const slug = convertToSlug(payload.name);

    const isExist = await BrandModel.findOne({
      slug,
      _id: { $ne: brand._id },
    });

    if (isExist) {
      throw apiError(409, "Brand name already exists");
    }

    brand.name = payload.name;
    brand.slug = slug;
  }

  // Update active status
  if (payload.isActive !== undefined) {
    brand.isActive = payload.isActive;
  }

  // Update logo
  if (file) {
    if (brand.logo?.publicId) {
      await destroyFromCloudinary(brand.logo.publicId);
    }

    const image = await uploadToCloudinary(
      file.buffer,
      "ecom/brand"
    );

    brand.logo = image;
  }

  await brand.save();

  return brand;
};

// Delete brand
const deleteBrandService = async (brand) => {
  if (!brand) {
    throw apiError(404, "Brand not found");
  }

  // Delete logo from Cloudinary
  if (brand.logo?.publicId) {
    await destroyFromCloudinary(brand.logo.publicId);
  }

  // Soft delete
  brand.isActive = false;

  await brand.save();

  return brand;
};

module.exports = {
  getAllBrandsService,
  createBrandService,
  updateBrandService,
  deleteBrandService,
};