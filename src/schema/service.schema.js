const { Joi } = require('express-validation');

module.exports = {
  service: {
    body: Joi.object({
      companyId: Joi.string().required(),
      name: Joi.string().required(),
      description1: Joi.string().required(),
      description2: Joi.string().allow(null),
      modelName: Joi.string().required(),
      specification: Joi.string().allow(null),
      category: Joi.string().required(),
      price: Joi.string().required(),
    }),
  },
  list: {
    query: Joi.object().keys({
      pageNo: Joi.number().positive().integer().default(1),
      pageSize: Joi.number().positive().integer().default(10),
      sortBy: Joi.string().default('updatedAt'),
      sortOrder: Joi.number().default(1).allow(1, -1),
    }).allow(null),
  },
};
