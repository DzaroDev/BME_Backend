const express = require('express');
const jwt = require('jsonwebtoken');
const { isString } = require('lodash');

// config
const config = require('../config');

// constants
const { errorMessages } = require('../constants/textVariables');

// helpers
const validateJoiSchema = require('../helpers/validateJoiSchema');

// controllers
const authController = require('../controllers/auth.controller');

// repositories
const userRepository = require('../repositories/user.repository');

// schemas
const userSchema = require('../schema/user.schema');

// helpers
const createError = require('../helpers/createError');

// express router
const router = express.Router();

router.post('/token', validateJoiSchema(userSchema.login), async (req, res, next) => {
  try {
    const { mobile, email, password } = req.body;
    let user = null;
    const query = {
      isVerified: true,
    };

    if (isString(mobile)) {
      query.mobile = mobile;
    }

    if (isString(email)) {
      query.email = email;
    }

    user = await userRepository.findUserByQuery(query);

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    const isPwdValid = await user.comparePassword(password);

    if (!isPwdValid) {
      return next(createError(400, errorMessages.INVALID_USER_PWD));
    }

    // create/sign token by user id
    const token = jwt.sign({ user: user.id }, config.jwtSecret);
    
    res.json({ statusCode: 200, data: { user, token } });
  } catch (error) {
    next(error);
  }
});

router.post('/send-otp', validateJoiSchema(userSchema.otp), async (req, res, next) => {
  try {
    if (isString(req.body.mobile)) {
      return authController.sendOtpForMobileRegister(req, res, next);
    }
    if (isString(req.body.email)) {
      return authController.sendOtpForEmailRegister(req, res, next);
    }
    return next(createError(500, errorMessages.SOMETHING_WENT_WRONG));
  } catch (error) {
    next(error);
  }
});

router.post('/verify-otp', validateJoiSchema(userSchema.verifyOtp), async (req, res, next) => {
  try {
    if (isString(req.body.mobile)) {
      return authController.verifyMobileOtp(req, res, next);
    }
    if (isString(req.body.email)) {
      return authController.verifyEmailOtp(req, res, next);
    }
    return res.json({ message: errorMessages.SOMETHING_WENT_WRONG });
  } catch (error) {
    next(error);
  }
});

module.exports = router;