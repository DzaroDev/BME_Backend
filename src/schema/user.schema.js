const { Joi } = require('express-validation');

const userTypes = require('../constants');

module.exports = {
  login: {
    body: Joi.object().keys({
      password: Joi.string()
        .min(8)
        .max(25)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({'string.pattern.base': 'Password must have minimum 8 characters including capital and lowercase letters and special characters.'}),
      mobile: Joi.string()
        .empty(null)
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
      email: Joi.string()
        .empty(null)
        .email({ tlds: { allow: false } }),
    }).or('mobile', 'email'),
  },
  otp: {
    body: Joi.object().keys({
      mobile: Joi.string()
        .empty(null)
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
      email: Joi.string()
        .empty(null)
        .email({ tlds: { allow: false } }),
    }).or('mobile', 'email'),
  },
  verifyOtp: {
    body: Joi.object().keys({
      code: Joi.string()
        .regex(/^[0-9]{6}$/)
        .messages({'string.pattern.base': 'OTP must have 6-digits.'}),
      mobile: Joi.string()
        .empty(null)
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
      email: Joi.string()
        .empty(null)
        .email({ tlds: { allow: false } }),
    }).or('mobile', 'email'),
  },
  user: {
    body: Joi.object({
      userType: Joi.number()
        .valid(...userTypes.companyUserTypes, ...userTypes.nonCompanyUserTypes)
        .messages({'any.invalid': 'Invalid user type provided!'}),
      category: Joi.string()
        .when('userType', {
          is: Joi.number().valid(...userTypes.companyUserTypes),
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        }),
      firstName: Joi.string()
        .min(3)
        .max(200)
        .required(),
      lastName: Joi.string().allow('').optional(),
      mobile: Joi.string()
        .allow('')
        .optional()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
      email: Joi.when('mobile', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.string().email({ tlds: { allow: false } }).required(),
      }),
      password: Joi.string()
        .min(8)
        .max(25)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({'string.pattern.base': 'Password must have minimum 8 characters including capital and lowercase letters and special characters.'}),
      city: Joi.string().required(),
      company: Joi.string().optional(),
      institute: Joi.string().optional(),
      website: Joi.string().optional(),
    })
  },
  updateUser: {
    body: Joi.object().keys({
      firstName: Joi.string().min(3).max(200),
      lastName: Joi.string(),
      city: Joi.string(),
      company: Joi.string(),
      institute: Joi.string(),
      website: Joi.string(),
    }).min(1).message('No field has been provided.'),
  },
}