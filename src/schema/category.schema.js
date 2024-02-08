const { Joi } = require('express-validation');

const schema = {
  category: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
}

module.exports = schema;
