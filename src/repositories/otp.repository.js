const { isString } = require('lodash');

// models
const otpModel = require('../models/otp.model');

module.exports = {
  findOtpByQuery: async (query) => {
    const output = await otpModel.findOne(query).exec();
    return output;
  },
  findOtpForMobileVerification: async (mobile, purpose) => {
    const output = await otpModel.findOne({
      value: mobile,
      purpose: purpose,
    });
    return output;
  },
  findOtpByMobile: async (mobile) => {
    const output = await otpModel.findOne({ value: mobile, isEmailType: false });
    return output;
  },
  findOtpByEmail: async (email) => {
    const output = await otpModel.findOne({ value: email, isEmailType: true });
    return output;
  },
  saveOtp: async (otpObj) => {
    otpObj = {
      value: otpObj?.mobile || otpObj?.email || '',
      code: otpObj.code,
      purpose: otpObj.purpose,
      isEmailType: isString(otpObj?.email),
    }
    otpObj = new otpModel({ ...otpObj });
    return await otpObj.save();
  },
  verifyOtp: async (otpObj) => {
    otpObj = {
      value: otpObj?.mobile || otpObj?.email || '',
      purpose: otpObj.purpose,
      isEmailType: isString(otpObj.email),
      user: otpObj.userId, // new
    }
    otpObj = new otpModel({ ...otpObj });
    return await otpObj.save();
  },
}
