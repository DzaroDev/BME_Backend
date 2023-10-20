const { validate: expressValidate } = require('express-validation');

/**
 * Wrapper around joi to validate the api requests.
 * @param {Joi} schema - Joi schema to be validated using express validation
 */
function validateJoiSchema(schema) {
  return expressValidate(schema, { keyByField: true }, { abortEarly: false });
}

module.exports = validateJoiSchema;
