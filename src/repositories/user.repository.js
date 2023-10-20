const { isString } = require('lodash');

// config
const config = require('../config');

// constants
const { userTypes } = require('../constants');

// models
const userModel = require('../models/user.model');

module.exports = {
  saveUser: async (user) => {
    user = new userModel(user);
    return await user.save();
  },
  createVerifiedUser: async (user) => {
    const query = {};
    
    if (isString(user.mobile)) query.mobile = user.mobile;
    if (isString(user.email)) query.email = user.email;
    
    // delete the un-verified user
    await userModel.findOneAndDelete(query);
    
    // save new verified user
    user.isActive = true;
    user.isVerified = true;
    user = new userModel(user);
    user = await user.save();
    
    return user;
  },
  findAdminUser: async () => {
    const user = await userModel
      .findOne({ email: config.adminUser.name, userType: userTypes.ADMIN })
      .exec();
    return user;
  },
  findUserByQuery: async (query) => {
    const output = await userModel.findOne(query).exec();
    return output;
  },
  findOneByEmail: async (email) => {
    const user = await userModel.findOne({ email });
    return user;
  },
  findOneByMobile: async (mobile) => {
    const user = await userModel.findOne({ mobile });
    return user;
  },
  findNonVerifiedUserByMobile: async (mobile) => {
    const output = await userModel.findOne({ mobile, isVerified: false });
    return output;
  },
  findNonVerifiedUserByEmail: async (email) => {
    const output = await userModel.findOne({ email, isVerified: false });
    return output;
  },
  findUserAndUpdate: async (updateUser) => {
    const output = await userModel.findByIdAndUpdate(updateUser.id, updateUser, { new: true });
    return output;
  },
}
