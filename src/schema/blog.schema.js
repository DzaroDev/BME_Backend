const { Joi } = require('express-validation');
const { values } = require('lodash');
const { blogStatus, sortOrder } = require('../constants');

const blogStatusVals = values(blogStatus);
const sortOrdersVals = values(sortOrder);

const schema = {
  blog: {
    body: Joi.object({
      titleText: Joi.string().required(),
      mainText: Joi.string().required(),
      summaryText: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.number().positive().integer().required().valid(...blogStatusVals),
    }),
  },
  updateBlog: {
    body: Joi.object({
      titleText: Joi.string(),
      mainText: Joi.string(),
      summaryText: Joi.string(),
      category: Joi.string(),
    }),
  },
  updateBlogStatus: {
    body: Joi.object({
      blogId: Joi.string().required(),
      status: Joi.number().positive().integer().required().valid(...blogStatusVals),
    }),
  },
  listBlogs: {
    query: Joi.object().keys({
      pageNo: Joi.number().positive().integer(),
      pageSize: Joi.number().positive().integer(),
      status: Joi.number().positive().integer().valid(...blogStatusVals),
      sortBy: Joi.string(),
      sortOrder: Joi.number().valid(...sortOrdersVals),
    }).allow(null),
  },
}

module.exports = schema;
