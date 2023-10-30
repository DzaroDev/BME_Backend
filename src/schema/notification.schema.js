const { Joi } = require('express-validation');

const schema = {
  notification: {
    body: Joi.object({
      title: Joi.string().required(),
      body: Joi.string().required(),
      notifyType: Joi.string().allow(null),
      shouldNotifyAll: Joi.boolean().default(false),
      receivedByUsers: Joi.array().min(1).required(),
    }),
  },
  updateNotification: {
    body: Joi.object({
      isRead: Joi.boolean().required(),
    }),
  },
}

module.exports = schema;
