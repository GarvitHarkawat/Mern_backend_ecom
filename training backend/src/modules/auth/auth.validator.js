const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(60)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 60 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password cannot exceed 128 characters",
      "any.required": "Password is required",
    }),

  role: Joi.string()
    .valid("user", "seller")
    .default("user")
    .messages({
      "any.only": "Role must be either user or seller",
    }),
});


const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});


const refreshSchema = Joi.object({
  // refresh token cookie se aayega,
  // body se nahi.
});


const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Old password is required",
      "any.required": "Old password is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters",
      "string.max": "New password cannot exceed 128 characters",
      "any.required": "New password is required",
    }),

  
});


module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
};