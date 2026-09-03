const Joi = require("joi");

// ===== Create brand =====
const createBrandValidator = Joi.object({
    name: Joi.string().trim().required(),
    isActive: Joi.boolean(),
});

// ===== Update brand =====
const updateBrandValidator = Joi.object({
    name: Joi.string().trim(),
    isActive: Joi.boolean(),
}).min(1);

module.exports = {
    createBrandValidator,
    updateBrandValidator,
};