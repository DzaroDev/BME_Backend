const { Joi } = require('express-validation');

const schema = {
  blog: {
    body: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      conclusion: Joi.string().allow(null),
    }),
  },
  updateBlog: {
    body: Joi.object({
      title: Joi.string().allow(null),
      content: Joi.string().allow(null),
      conclusion: Joi.string().allow(null),
    }),
  },
}

module.exports = schema;
