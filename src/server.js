const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const { ValidationError } = require('express-validation');
const helmet = require('helmet');
const routes = require('./routes');
const config = require('./config');
const APIError = require('./helpers/APIError');
const createError = require('./helpers/createError');

// const crypto = require('crypto').randomBytes(6).toString('hex');
// console.log({ crypto })

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(
  cors({
    origin: '*',
  }),
);

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    const apiError = createError(err.status, 'Invalid token was provided');
    return next(apiError);
  }
  if (err instanceof ValidationError) {
    // validation error contains details object which has error message attached to error property.
    const allErrors = err.details.map((pathErrors) => Object.values(pathErrors).join(', '));
    const unifiedErrorMessage = allErrors.join(', ').replace(/, ([^,]*)$/, ' and $1');
    const error = new APIError(unifiedErrorMessage, err.statusCode);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = createError(404);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  res.status(err.status).json({
    // eslint-disable-line implicit-arrow-linebreak
    statusCode: err.status,
    message: err.message,
    stack: config.env === 'development' ? err.stack : {},
  })
});

module.exports = app;
