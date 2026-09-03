const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("./product.controller");
const { uploadMedia } = require("../../middlewares/upload.middleware");
const authenticate = require("../../middlewares/authenticate.middleware");
const loadResource = require("../../middlewares/loadResource.middleware");
const ProductModel = require("../../models/product.model");
const validate = require("../../middlewares/validate.middleware"); // ye actual validate function hai
const {
    createProductValidator,
    updateProductValidator,
} = require("./product.validator");

// ===== Public routes (no auth required) =====

// Get all products with filters (PLP)
ProductRouter.get("/", ProductController.getAllProductListFilter);

// Search products
ProductRouter.get("/search", ProductController.searchProducts);

// Get single product by slug
ProductRouter.get("/:slug", ProductController.getSingleProduct);

// ===== Private routes (auth required) =====
ProductRouter.use(authenticate);

// Get logged-in seller's own products
ProductRouter.get("/seller/mine", ProductController.getAllSellerProducts);

// Get all products (admin)
ProductRouter.get("/admin/all", ProductController.getAllProductsAdmin);

// Create product
ProductRouter.post(
    "/",
    validate(createProductValidator),
    uploadMedia.array("images", 3),
    ProductController.createProduct,
);

// Update product
ProductRouter.patch(
    "/:id",
    loadResource(ProductModel),
    validate(updateProductValidator),
    uploadMedia.array("images", 3),
    ProductController.updateProduct,
);

// Update product status only
ProductRouter.patch(
    "/:id/status",
    loadResource(ProductModel),
    ProductController.updateProductStatus,
);

// Delete product
ProductRouter.delete(
    "/:id",
    loadResource(ProductModel),
    ProductController.deleteProduct,
);

module.exports = ProductRouter;