const apiError = require("../../utils/apiError");
const BrandModel = require("../../models/brand.model");
const CategoryModel = require("../../models/category.model");
const ProductModel = require("../../models/product.model");
const { CONFLICT, NOT_FOUND, BAD_REQUEST } = require("../../utils/httpStatus");
const { convertToSlug } = require("../../utils/slug");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");

// ============ search products ============
const search = async (query) => {
    const filter = { isActive: true };

    if (query.q) filter.title = { $regex: query.q, $options: "i" };

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(24, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        ProductModel.find(filter)
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .populate("seller", "name shopName")
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit),
        ProductModel.countDocuments(filter),
    ]);

    return { products, page, pages: Math.ceil(total / limit) || 1, total };
};

// ============ get single product by slug ============
const getSingle = async (slug) => {
    const product = await ProductModel.findOne({ slug })
        .populate("category", "name slug")
        .populate("subCategory", "name slug")
        .populate("brand", "name slug")
        .populate("seller", "name shopName");

    if (!product) {
        throw apiError(NOT_FOUND, "product not found");
    }

    return product;
};

// ============ get seller's own products ============
const getAllSeller = async (sellerId, query) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(24, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        ProductModel.find({ seller: sellerId })
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .populate("seller", "name shopName")
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit),
        ProductModel.countDocuments({ seller: sellerId }),
    ]);

    return { products, page, pages: Math.ceil(total / limit) || 1, total };
};

// ============ delete product ============
const deleteSingle = async (product) => {
    await product.deleteOne();
    await Promise.all(product.images.map((img) => destroyFromCloudinary(img.publicId)));
    return product;
};

// ============ update status ============
const updateStatus = async (product, payload) => {
    product.isActive = payload.isActive;
    await product.save();
    return product;
};

// ============ get all products (admin) ============
const getAllAdmin = async (query = {}) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(24, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        ProductModel.find({})
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .populate("seller", "name shopName")
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit),
        ProductModel.countDocuments({}),
    ]);

    return { products, page, pages: Math.ceil(total / limit) || 1, total };
};

// ============ create product ============
const create = async (sellerId, payload, files = []) => {
    const slug = convertToSlug(payload.title);

    const isExist = await ProductModel.findOne({ slug });
    if (isExist) {
        throw apiError(CONFLICT, "Product already exist");
    }
    payload.slug = slug;

    if (payload.price > payload.mrp) {
        throw apiError(BAD_REQUEST, "Price cannot be more than MRP");
    }

    if (files.length === 0) {
        throw apiError(BAD_REQUEST, "Add at least one image");
    }

    const images = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, "ecom/product")),
    );

    payload.images = images;
    payload.seller = sellerId;

    const result = await ProductModel.create(payload);

    return result;
};

// ============ build filter (helper) ============
const buildFilter = async (query) => {
    const filter = { isActive: true };

    if (query.search) filter.title = { $regex: query.search, $options: "i" };

    if (query.category) {
        const category = await CategoryModel.findOne({ slug: query.category });
        if (category) {
            const children = await CategoryModel.find({ parent: category._id }).select("_id");
            filter.category = { $in: [category._id, ...children.map((c) => c._id)] };
        }
    }

    if (query.brand) {
        const brand = await BrandModel.findOne({ slug: query.brand });
        if (brand) filter.brand = brand._id;
    }

    const min = Number(query.minPrice);
    const max = Number(query.maxPrice);
    if (Number.isFinite(min) || Number.isFinite(max)) {
        filter.price = {
            ...(Number.isFinite(min) && { $gte: min }),
            ...(Number.isFinite(max) && { $lte: max }),
        };
    }

    return filter;
};

// ============ get all products with filters (PLP) ============
const getAllProductsFilter = async (query) => {
    const filter = await buildFilter(query);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(24, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        ProductModel.find(filter)
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .populate("seller", "name shopName")
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit),
        ProductModel.countDocuments(filter),
    ]);

    return { products, page, pages: Math.ceil(total / limit) || 1, total };
};

// ============ update product ============
const update = async (product, payload, files = []) => {
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) product[key] = value;
    });

    if (product.price > product.mrp) {
        throw apiError(BAD_REQUEST, "Price cannot be more than MRP");
    }

    if (files.length > 0) {
        const images = await Promise.all(
            files.map((f) => uploadToCloudinary(f.buffer, "ecom/product")),
        );
        const old = product.images;
        product.images = images;
        await Promise.all(old.map((img) => destroyFromCloudinary(img.publicId)));
    }

    await product.save();
    return product;
};

module.exports = {
    search,
    getSingle,
    getAllSeller,
    update,
    deleteSingle,
    updateStatus,
    getAllAdmin,
    create,
    getAllProductsFilter,
};