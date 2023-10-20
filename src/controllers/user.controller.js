const { isString } = require('lodash');
const jwt = require('jsonwebtoken');

// config
const config = require('../config');

// constants
const { userTypes } = require('../constants');

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
  getUserByToken: async (req, res) => {
    let user = req?.auth?.user;
    console.log('--getUserByToken--', user);

    if (!user) {
      return res.status(400).json({ message: errorMessages.INVALID_TOKEN });
    }

    user = await userRepository.findUserByQuery({ _id: user });

    if (!user) {
      return res.status(400).json({ message: errorMessages.USER_DOES_NOT_EXIST });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: errorMessages.USER_NOT_VERIFIED });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: errorMessages.USER_NOT_ACTIVE });
    }

    return res.json({ data: user });
  },
  createUser: async (req, res) => {
    const userInputObj = req.body;
    let userObj = null;
    
    // check if user with mobile
    if (isString(userInputObj.mobile)) {
      userObj = await userRepository.findOneByMobile(userInputObj.mobile);
      if (!userObj) {
        return res.status(400).json({ message: errorMessages.MOBILE_NOT_VERIFIED });
      }
      if (userObj.isVerified) {
        return res.status(400).json({ message: errorMessages.MOBILE_ALREADY_VERIFIED });
      }
    }
    // check if user with email
    if (isString(userInputObj.email)) {
      userObj = await userRepository.findOneByEmail(userInputObj.email);
      if (!userObj) {
        return res.status(400).json({ message: errorMessages.EMAIL_NOT_VERIFIED });
      }
      if (userObj.isVerified) {
        return res.status(400).json({ message: errorMessages.EMAIL_ALREADY_VERIFIED });
      }
    }

    // save new user
    userObj = await userRepository.createVerifiedUser(userInputObj);

    return res.json({ data: userObj });
  },
  updateUser: async (req, res) => {
    let user = req.body;
    user.id = req?.auth?.user;
    
    if (!user?.id) {
      return res.status(400).json({ message: errorMessages.INVALID_TOKEN });
    }
    
    user = await userRepository.findUserAndUpdate(user);

    return res.json({ data: user });
  },
}