const Joi = require("joi");

const createProductValidator = Joi.object({
    title: Joi.string().trim().max(140).required(),

    description: Joi.string().max(4000).allow("", null),

    price: Joi.number().min(1).required(),

    mrp: Joi.number().min(1).required(),

    category: Joi.string().hex().length(24).required(),

    subCategory: Joi.string().hex().length(24),

    brand: Joi.string().hex().length(24),

    stockQty: Joi.number().min(0).required(),

    tags: Joi.array().items(Joi.string().valid("trending", "top-selling", "new")),

    isActive: Joi.boolean(),
});

const updateProductValidator = Joi.object({
    title: Joi.string().trim().max(140),

    description: Joi.string().max(4000).allow("", null),

    price: Joi.number().min(1),

    mrp: Joi.number().min(1),

    category: Joi.string().hex().length(24),

    subCategory: Joi.string().hex().length(24),

    brand: Joi.string().hex().length(24),

    stockQty: Joi.number().min(0),

    tags: Joi.array().items(Joi.string().valid("trending", "top-selling", "new")),

    isActive: Joi.boolean(),
}).min(1); // at least ek field toh update ke liye chahiye

module.exports = {
    createProductValidator,
    updateProductValidator,
};