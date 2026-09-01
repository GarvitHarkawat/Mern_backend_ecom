const CategoryModel = require("../../models/category.model");
const apiError = require("../../utils/apiError");
const {
  uploadToCloudinary,
  destroyFromCloudinary,
} = require("../../utils/upploadToCloudinary");
const convertToSlug = require("../../utils/slug");

//get all category service==============
const getAllCategoryService = async () => {
  const result = await CategoryModel.find({ isActive: true }).lean();
  return result;
};

// =======level check function==========
const levelCheck = async (parentID) => {
  if (
    parentID === null ||
    parentID === undefined ||
    parentID === "" ||
    parentID === "null"
  ) {
    return null;
  }

  const parent = await CategoryModel.findById(parentID);

  if (!parent) {
    throw apiError(404, "Parent category not found");
  }

  if (parent.parent) {
    throw apiError(400, "Only two levels are allowed");
  }

  return parent._id;
};

// =========create category service==========
const createCategoryService = async (payload, file) => {
  payload.slug = convertToSlug(payload.name);

  const isExist = await CategoryModel.findOne({
    slug: payload.slug,
  });

  if (isExist) {
    throw apiError(409, "category already exist");
  }

  payload.parent = await levelCheck(payload.parent);

  if (file) {
    const image = await uploadToCloudinary(file.buffer, "ecom/category");

    payload.image = image;
  }

  const result = await CategoryModel.create(payload);

  return result;
};

//=====update category service=========
const updateCategoryService = async (category, payload, file) => {
  if (payload.name && payload.name !== category.name) {
    payload.slug = convertToSlug(payload.name);
  }
  // Check slug only if slug is being updated
  if (payload.slug && payload.slug !== category.slug) {
    const isExist = await CategoryModel.findOne({
      slug: payload.slug,
      _id: { $ne: category._id },
    });

    if (isExist) {
      throw apiError(409, "Category already exists");
    }
  }

  // Check parent only if parent is being updated
  if (payload.parent !== undefined) {
    const parent_id = await levelCheck(payload.parent);

    // Category cannot be its own parent
    if (parent_id && parent_id.toString() === category._id.toString()) {
      throw apiError(400, "Category cannot be its own parent");
    }

    payload.parent = parent_id;
  }

  // Update image if new image is provided
  if (file) {
    const uploadedImage = await uploadToCloudinary(
      file.buffer,
      "CategoryPictures",
    );

    // Delete old image from Cloudinary
    if (category.image?.publicId) {
      await destroyFromCloudinary(category.image.publicId);
    }

    payload.image = {
      url: uploadedImage.url,
      publicId: uploadedImage.publicId,
    };
  }

  const result = await CategoryModel.findByIdAndUpdate(category._id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

//=============dalate category service===========
const deleteCategoryService = async (category) => {
  // Check if category exists
  if (!category) {
    throw apiError(404, "Category not found");
  }

  // Check if category has children
  const childCategory = await CategoryModel.findOne({
    parent: category._id,
    isActive: true,
  });

  if (childCategory) {
    throw apiError(
      400,
      "Category cannot be deleted because it has child categories",
    );
  }

  // Delete image from Cloudinary if exists
  if (category.image?.publicId) {
    await destroyFromCloudinary(category.image.publicId);
  }

  // Soft delete category
  const result = await CategoryModel.findByIdAndUpdate(
    category._id,
    { isActive: false },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

//=========get all tree category service==========
const getAllTreeCategoryService = async () => {
  const categories = await CategoryModel.find({
    isActive: true,
  })
    .sort({ position: 1, name: 1 })
    .lean();

  const categoryMap = {};

  categories.forEach((category) => {
    category.children = [];
    categoryMap[category._id.toString()] = category;
  });

  const tree = [];

  categories.forEach((category) => {
    if (category.parent) {
      const parent = categoryMap[category.parent.toString()];

      if (parent) {
        parent.children.push(category);
      }
    } else {
      tree.push(category);
    }
  });

  return tree;
};
module.exports = {
  getAllCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getAllTreeCategoryService,
};
