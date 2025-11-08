const Joi = require("joi")

const bookingValidator = {
  createBooking: Joi.object({
    serviceType: Joi.string().required(),
    subService: Joi.string(),
    duration: Joi.number().required(),
    basePrice: Joi.number().required(),
    location: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      zipCode: Joi.string(),
      coordinates: Joi.array().items(Joi.number()),
    }).required(),
    scheduledDate: Joi.date().required(),
    scheduledTime: Joi.string().required(),
    specialInstructions: Joi.string(),
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid("assigned", "confirmed", "in-progress", "completed", "cancelled").required(),
  }),

  assignWorker: Joi.object({
    workerId: Joi.string().required(),
  }),

  addFeedback: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string(),
    photos: Joi.array().items(Joi.string()),
  }),

  cancelBooking: Joi.object({
    reason: Joi.string().required(),
  }),
}

module.exports = bookingValidator
