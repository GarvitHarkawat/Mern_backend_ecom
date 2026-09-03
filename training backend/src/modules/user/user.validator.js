const Joi = require("joi");

// ===== Update own profile =====
const updateProfileValidator = Joi.object({
    name: Joi.string().trim().max(128),
    phone: Joi.string().trim().max(10).pattern(/^[6-9]\d{9}$/),
    shopName: Joi.string().trim(),
}).min(1);

// ===== Create address =====
const createAddressValidator = Joi.object({
    label: Joi.string().trim().max(120),
    street: Joi.string().trim().max(120),
    phone: Joi.string().trim().max(10).pattern(/^[6-9]\d{9}$/),
    city: Joi.string().trim().max(120).required(),
    state: Joi.string().trim().max(120).required(),
    pincode: Joi.number().integer().min(100000).max(999999).required(),
    isDefault: Joi.boolean(),
});

// ===== Update address =====
const updateAddressValidator = Joi.object({
    label: Joi.string().trim().max(120),
    street: Joi.string().trim().max(120),
    phone: Joi.string().trim().max(10).pattern(/^[6-9]\d{9}$/),
    city: Joi.string().trim().max(120),
    state: Joi.string().trim().max(120),
    pincode: Joi.number().integer().min(100000).max(999999),
    isDefault: Joi.boolean(),
}).min(1);

module.exports = {
    updateProfileValidator,
    createAddressValidator,
    updateAddressValidator,
};