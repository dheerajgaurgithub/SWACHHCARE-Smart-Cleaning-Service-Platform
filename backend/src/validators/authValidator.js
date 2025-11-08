const Joi = require("joi")

const authValidator = {
  register: Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    password: Joi.string().min(6).required(),
  }),

  registerWorker: Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    password: Joi.string().min(6).required(),
    skills: Joi.array().items(Joi.string()),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  sendOTP: Joi.object({
    identifier: Joi.string().required(),
  }),

  verifyOTP: Joi.object({
    identifier: Joi.string().required(),
    code: Joi.string().length(6).required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
}

module.exports = authValidator
