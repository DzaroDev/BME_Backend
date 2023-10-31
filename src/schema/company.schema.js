const { Joi } = require('express-validation');
const { companyUserTypes, nonCompanyUserTypes } = require('../constants');

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

const updateCompanySchema = {
  name: Joi.string().allow(null),
  address1: Joi.string().allow(null),
  address2: Joi.string().allow(null),
  city: Joi.string().allow(null),
  state: Joi.string().allow(null),
  mobileCode: Joi.string().allow(null),
  mobile: Joi.string()
    .allow(null)
    .regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': 'Mobile must have 10-digits.'}),
  description: Joi.string().allow(null),
  biomedicalExpertise: Joi.string().allow(null),
}

const schema = {
  company: {
    body: Joi.object(companySchema),
  },
  updateCompany: {
    body: Joi.object(updateCompanySchema),
  },
  listCompany: {
    query: Joi.object().keys({
      pageNo: Joi.number().positive().integer().default(1),
      pageSize: Joi.number().positive().integer().default(10),
      sortBy: Joi.string().default('updatedAt'),
      sortOrder: Joi.number().default(1).allow(1, -1),
    }).allow(null),
  },
  studentCompany: {
    body: Joi.object({
      userType: Joi.number()
        .required()
        .valid(...companyUserTypes)
        .messages({'any.invalid': 'Invalid user type provided!'}),
      category: Joi.string()
        .when('userType', {
          is: Joi.number().valid(...companyUserTypes),
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        }),
    }).append(companySchema),
  },
}

module.exports = schema;
