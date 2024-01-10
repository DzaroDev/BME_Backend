const { Joi } = require('express-validation')

const userTypes = require('../constants');

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
  mobile: Joi.string()
    .allow(null)
    .regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
  mobileCode: Joi.when('mobile', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.allow(null),
  }),
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
  city: Joi.string().allow(null),
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

const companyTeamSchema = Joi.object({
  name: Joi.string().required().messages({ 'any.required': 'Member name is required' }),
  title: Joi.string().required().messages({ 'any.required': 'Member title is required' }),
  description: Joi.string().allow(null),
  socialLinks: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({ 'any.required': 'Social name is required' }),
        link: Joi.string().required().messages({ 'any.required': 'Social URL is required' }),
      })
    )
    .allow(null),
});

const companySchema = {
  name: Joi.string().required(),
  registrationId: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().allow(null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  mobileCode: Joi.string().required(),
  mobile: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
  email: Joi.string().email({ tlds: { allow: false } }),
  description: Joi.string().allow(null),
  biomedicalExpertise: Joi.string().allow(null),
  members: Joi.array().items(companyTeamSchema).allow(null),
}

const serviceSchema = {
  name: Joi.string().required(),
  description1: Joi.string().required(),
  description2: Joi.string().allow(null),
  modelName: Joi.string().required(),
  specification: Joi.string().allow(null),
  category: Joi.string().required(),
  price: Joi.string().required(),
}

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
    }).xor('mobile', 'email').messages({
      'object.xor': 'Either mobile or email should be provided.'
    }),
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
    }).xor('mobile', 'email').messages({
      'object.xor': 'Either mobile or email should be provided.'
    }),
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
    }).xor('mobile', 'email').messages({
      'object.xor': 'Either mobile or email should be provided.'
    }),
  },
  user: {
    body: Joi.alternatives().conditional(
      Joi.object({ userType: Joi.number().valid(...userTypes.adminUserTypes) }).unknown(), {
        then: adminUserSchema,
        otherwise: userSchema,
      }
    )
  },
  registerUser: {
    body: Joi.object({
      user: userSchema,
      company: Joi.object(companySchema).allow(null),
      service: Joi.object(serviceSchema).allow(null),
    }),
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