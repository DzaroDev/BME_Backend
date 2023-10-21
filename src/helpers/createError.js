const createHttpError = require('http-errors');

function createError(status = 500, message) {
  if (message) return createHttpError(status, message);
  return createHttpError(status);
}

module.exports = createError;
