const { Joi } = require('express-validation');

module.exports = {
  plan: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(null).allow(""),
      price: Joi.number().positive().integer().allow(0).required(),
      durationDays: Joi.number().positive().integer().allow(0).required(),
    }),
  },
  updatePlan: {
    body: Joi.object({
      name: Joi.string().allow(null),
      description: Joi.string().allow(null).allow(""),
      price: Joi.number().positive().integer().allow(0).allow(null),
      durationDays: Joi.number().positive().integer().allow(0).allow(null),
    }),
  },
};
