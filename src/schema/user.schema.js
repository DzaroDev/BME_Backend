const { Joi } = require('express-validation')

const userTypes = require('../constants')

const adminUserSchema = Joi.object({
  userType: Joi.number().valid(...userTypes.adminUserTypes).messages({'any.invalid': 'Invalid user type provided!'}),
  firstName: Joi.string()
    .min(3)
    .max(200)
    .required(),
  lastName: Joi.string().allow(null, ''),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({'string.pattern.base': 'Password must be atleast 8 characters including uppercase,lowercase and special characters.'}),
})

const userSchema = Joi.object({
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
  lastName: Joi.string().allow(null),
  mobileCode: Joi.string().allow(null),
  mobile: Joi.string()
    .allow(null)
    .regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
  email: Joi.when('mobile', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().email({ tlds: { allow: false } }).required(),
  }),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({'string.pattern.base': 'Password must be atleast 8 characters including uppercase,lowercase and special characters.'}),
  city: Joi.string().required(),
  company: Joi.string().allow(null),
  institute: Joi.string().allow(null),
  website: Joi.string().allow(null),
  preferences: Joi.object({
    pushNotification: Joi.boolean().default(true),
    sms: Joi.boolean().default(true),
    email: Joi.boolean().default(true),
    autoRenewSubscription: Joi.boolean().default(false),
  }),
})

module.exports = {
  userProfile: {
    params: Joi.object({
      userId: Joi.string().required(),
    }),
    body: Joi.object({
      profileType: Joi.number().valid(...userTypes.companyUserTypes).required().messages({
        'any.only': 'Invalid user profile'
      }),
    }),
  },
  login: {
    body: Joi.object().keys({
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({'string.pattern.base': 'Password must be atleast 8 characters including uppercase,lowercase and special characters.'}),
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
    body: Joi.alternatives().conditional(
      Joi.object({ userType: Joi.number().valid(...userTypes.adminUserTypes) }).unknown(), {
        then: adminUserSchema,
        otherwise: userSchema,
      }
    )
  },
  updateUser: {
    body: Joi.object().keys({
      firstName: Joi.string().min(3).max(200),
      lastName: Joi.string(),
      userType: Joi.number()
        .valid(...userTypes.companyUserTypes, ...userTypes.nonCompanyUserTypes)
        .messages({'any.invalid': 'Invalid user type provided!'}),
      category: Joi.string()
        .when('userType', {
          is: Joi.number().valid(...userTypes.companyUserTypes),
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        }),
      city: Joi.string(),
      company: Joi.string(),
      institute: Joi.string(),
      website: Joi.string(),
      preferences: Joi.object({
        pushNotification: Joi.boolean().default(true),
      }),
    }).min(1).message('No field has been provided.'),
  },
  updateAdminUser: {
    body: Joi.object().keys({
      firstName: Joi.string().min(3).max(200),
      lastName: Joi.string().allow(null),
    }).min(1).message('No field has been provided.'),
  },
  listUsers: {
    query: Joi.object({
      onlyAdmin: Joi.boolean().default(false)
    }),
  },
  resetAdminPassword: {
    body: Joi.object().keys({
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({'string.pattern.base': 'Password must be atleast 8 characters including uppercase,lowercase and special characters.'}),
    }).min(1).message('No field has been provided.'),
  },
  resetPassword: {
    body: Joi.object().keys({
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({'string.pattern.base': 'Password must be atleast 8 characters including uppercase,lowercase and special characters.'}),
      code: Joi.string()
        .regex(/^[0-9]{6}$/)
        .required()
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
}