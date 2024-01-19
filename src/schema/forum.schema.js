const { Joi } = require('express-validation');
const { values } = require('lodash');

const { sortOrder } = require('../constants');

const sortOrdersVals = values(sortOrder);

const schema = {
  forumPost: {
    body: Joi.object({
      content: Joi.string().required(),
      attachments: Joi.any().default([]),
    }),
  },
  forumPostComment: {
    body: Joi.object({
      content: Joi.string().required(),
    }),
  },
  pagination: {
    query: Joi.object().keys({
      pageNo: Joi.number().positive().integer(),
      pageSize: Joi.number().positive().integer(),
      sortBy: Joi.string(),
      sortOrder: Joi.number().valid(...sortOrdersVals),
    }).allow(null),
  },
}

module.exports = schema;
