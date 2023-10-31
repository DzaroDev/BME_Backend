const { Joi } = require('express-validation');
const { values } = require('lodash');
const { blogStatus } = require('../constants');

const blogStatusVals = values(blogStatus);

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
  statusUpdateBlog: {
    body: Joi.object({
      status: Joi.number().required().allow(...blogStatusVals),
    }),
  },
  listBlogs: {
    query: Joi.object().keys({
      pageNo: Joi.number().positive().integer().default(1),
      pageSize: Joi.number().positive().integer().default(10),
      status: Joi.allow(null).default(1),
      sortBy: Joi.string().default('updatedAt'),
      sortOrder: Joi.number().default(1).allow(1, -1),
    }).allow(null),
  },
}

module.exports = schema;
