const Joi = require("joi")

const workerValidator = {
  updateAvailability: Joi.object({
    isAvailable: Joi.boolean().required(),
    location: Joi.object({
      type: Joi.string(),
      coordinates: Joi.array().items(Joi.number()),
    }),
    workingHours: Joi.object({
      startTime: Joi.string(),
      endTime: Joi.string(),
      daysOff: Joi.array().items(Joi.number()),
    }),
  }),

  recordAttendance: Joi.object({
    date: Joi.date().required(),
    checkIn: Joi.date().required(),
    checkOut: Joi.date(),
    hoursWorked: Joi.number(),
  }),

  requestPayout: Joi.object({
    amount: Joi.number().required(),
  }),

  updateSkills: Joi.object({
    skills: Joi.array().items(Joi.string()).required(),
  }),
}

module.exports = workerValidator
