const Joi = require("joi");

const createCategoryValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  parent: Joi.string().hex().length(24).allow(null, "", "null").optional(),

  position: Joi.number().integer().min(0).optional(),

  isActive: Joi.boolean().optional(),
});

const updateCategoryValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  slug: Joi.string().trim().lowercase().optional(),

  parent: Joi.string().hex().length(24).allow(null, "", "null").optional(),

  position: Joi.number().integer().min(0).optional(),

  isActive: Joi.boolean().optional(),
}).min(1);

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
