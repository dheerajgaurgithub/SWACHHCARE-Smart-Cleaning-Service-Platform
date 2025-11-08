const Joi = require("joi")

const userValidator = {
  updateProfile: Joi.object({
    name: Joi.string().min(3),
    avatar: Joi.string().uri(),
    addresses: Joi.array(),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  addAddress: Joi.object({
    label: Joi.string(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    isDefault: Joi.boolean(),
  }),
}

module.exports = userValidator
