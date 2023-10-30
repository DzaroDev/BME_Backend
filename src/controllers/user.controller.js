const { isString } = require('lodash');
const jwt = require('jsonwebtoken');

// config
const config = require('../config');

// constants
const { userTypes, nonCompanyUserTypes } = require('../constants');

// helpers
const createError = require('../helpers/createError');

// repositories
const userRepository = require('../repositories/user.repository');
const { errorMessages, successMessages } = require('../constants/textVariables');

module.exports = {
  createDefaultAdmin: async () => {
    let user = await userRepository.findAdminUser();
    if (user) return false;
    user = await userRepository.saveUser({
      email: config.adminUser.name,
      isActive: true,
      isVerified: true,
      password: config.adminUser.pwd,
      userType: userTypes.ADMIN,
    });
    return user;
  },
  getUserByToken: async (req, res, next) => {
    let user = req?.auth?.user;

    if (!user) {
      return next(createError(400, errorMessages.INVALID_TOKEN));
    }

    user = await userRepository.findUserByQuery({ _id: user });

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    if (!user.isVerified) {
      return next(createError(400, errorMessages.USER_NOT_VERIFIED));
    }

    if (!user.isActive) {
      return next(createError(400, errorMessages.USER_NOT_ACTIVE));
    }

    return res.json({ statusCode: 200, data: user });
  },
  createUser: async (req, res, next) => {
    const userInputObj = req.body;
    let userObj = null;
    
    // check if user with mobile
    if (isString(userInputObj.mobile)) {
      userObj = await userRepository.findOneByMobile(userInputObj.mobile);
      if (!userObj) {
        return next(createError(400, errorMessages.MOBILE_NOT_VERIFIED));
      }
      if (userObj.isVerified) {
        return next(createError(400, errorMessages.MOBILE_ALREADY_VERIFIED));
      }
    }
    // check if user with email
    if (isString(userInputObj.email)) {
      userObj = await userRepository.findOneByEmail(userInputObj.email);
      if (!userObj) {
        return next(createError(400, errorMessages.EMAIL_NOT_VERIFIED));
      }
      if (userObj.isVerified) {
        return next(createError(400, errorMessages.EMAIL_ALREADY_VERIFIED));
      }
    }

    // save new user
    userObj = await userRepository.createVerifiedUser(userInputObj);

    return res.json({ statusCode: 200, data: userObj });
  },
  updateUser: async (req, res, next) => {
    let user = req.body;
    user.id = req?.auth?.user;
    
    if (!user?.id) {
      return next(createError(400, errorMessages.INVALID_TOKEN));
    }

    user = await userRepository.findUserAndUpdate(user);

    return res.json({ data: user });
  },
  updateUserProfile: async (req, res, next) => {
    const userType = req.body.profileType;
    let user = req.params.userId;
    
    user = await userRepository.findUserByQuery({ _id: user });

    if (!nonCompanyUserTypes.includes(user.userType)) {
      return next(createError(400, errorMessages.INVALID_USR_PROFILE));
    }
    
    // update user type
    user.userType = userType;

    // save user
    user = await userRepository.findUserAndUpdate(user);

    return res.json({ statusCode: 200, data: user });
  },
  listAllUsers: async (req, res, next) => {
    const users = await userRepository.findAllUsers();
    return res.json({ statusCode: 200, data: users });
  },
}