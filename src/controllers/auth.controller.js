const jwt = require('jsonwebtoken');

// config
const config = require('../config');

// constants
const { otpPurpose } = require('../constants');
const { errorMessages, successMessages } = require('../constants/textVariables');

// helpers
const createError = require('../helpers/createError');

// helpers
const generateOtp = require('../helpers/generateOtp');
const generateRandomPwd = require('../helpers/generateRandomPwd');
const companyRepository = require('../repositories/company.repository');
// const generateTemplate = require('../helpers/generateTemplate');
// const sendMail = require('../helpers/sendMail');

// repositories
const otpRepository = require('../repositories/otp.repository');
const userRepository = require('../repositories/user.repository');
const sendOtpSms = require('../helpers/sendOtpSms');

module.exports = {
  sendOtpForMobileRegister: async (req, res, next) => {
    const mobile = req.body.mobile;
    // generate random OTP code
    const otpCode = config.env === 'development' ? process.env.DEFAULT_OTP : generateOtp();

    // save new otp
    const otpObj = await otpRepository.saveOtp({
      mobile,
      code: otpCode,
      purpose: otpPurpose.SIGN_UP,
    });

    // send sms for OTP
    if (config.env !== 'development') {
      sendOtpSms({ mobile, otpCode })
    }

    return res.json({ statusCode: 200, message: successMessages.MOBILE_OTP_SENT });
  },
  verifyMobileOtp: async (req, res, next) => {
    const { mobile, code } = req.body;

    let otpObj = await otpRepository.findOtpForMobileVerification(mobile, otpPurpose.SIGN_UP);

    if (!otpObj) {
      return next(createError(400, errorMessages.MOBILE_OTP_DOES_NOT_EXIST));
    }

    // check if already verified
    // if (otpObj.isVerified) {
    //   return next(createError(400, errorMessages.MOBILE_ALREADY_VERIFIED));
    // }

    // check if OTP matches
    if (otpObj.code !== code) {
      return next(createError(400, errorMessages.OTP_DOES_NOT_MATCH));
    }

    // update OTP in db
    if (!otpObj.isVerified) {
      otpObj.isVerified = true;
      await otpObj.save();
    }

    // find verified user
    let user = await userRepository.findUserByQuery({ mobile, isVerified: true });
    
    // check if user does not exist with email
    if (!user) {
      // create new user
      user = {
        mobile,
        password: generateRandomPwd(),
      };
      user = await userRepository.createVerifiedUser(user);
    }

    user = user.toJSON();
    const company = await companyRepository.findCompanyByQuery({ user: user.id });

    // create/sign token by user id
    const token = jwt.sign({ user: user.id }, config.jwtSecret);

    res.json({ statusCode: 200, message: successMessages.MOBILE_OTP_VERIFIED, data: { ...user, company, token } });
  },
  sendOtpForEmailRegister: async (req, res, next) => {
    const email = req.body.email;

    // generate random OTP code
    const otpCode = config.env === 'development' ? process.env.DEFAULT_OTP : generateOtp();

    // save new otp
    const otpObj = await otpRepository.saveOtp({
      email,
      code: otpCode,
      purpose: otpPurpose.SIGN_UP,
    });

    res.json({ message: successMessages.EMAIL_OTP_SENT });

    // send email for OTP
    // sendMail({ 
    //   toEmail: email,
    //   subject: 'Verify your email!',
    //   text: 'Text Verify your email!',
    //   template: generateTemplate(
    //     '../assets/signUpEmailTemplate.html',
    //     {
    //       name: '',
    //       code: otpCode,
    //     }
    //   ),
    // });
  },
  verifyEmailOtp: async (req, res, next) => {
    const { email, code } = req.body;

    let otpObj = await otpRepository.findOtpForMobileVerification(email, otpPurpose.SIGN_UP);

    if (!otpObj) {
      return next(createError(400, errorMessages.EMAIL_OTP_DOES_NOT_EXIST));
    }

    // check if already verified
    // if (otpObj.isVerified) {
    //   return next(createError(400, errorMessages.EMAIL_ALREADY_VERIFIED));
    // }

    // check if OTP matches
    if (otpObj.code !== code) {
      return next(createError(400, errorMessages.OTP_DOES_NOT_MATCH));
    }

    // update OTP in db
    if (!otpObj.isVerified) {
      otpObj.isVerified = true;
      await otpObj.save();
    }

    // find verified user
    let user = await userRepository.findUserByQuery({ email, isVerified: true });
    
    // check if user does not exist with email
    if (!user) {
      // create new user
      user = {
        email,
        password: generateRandomPwd(),
      };
      user = await userRepository.createVerifiedUser(user);
    }

    user = user.toJSON();
    const company = await companyRepository.findCompanyByQuery({ user: user.id });

    // create/sign token by user id
    const token = jwt.sign({ user: user.id }, config.jwtSecret);

    res.json({ statusCode: 200, message: successMessages.EMAIL_OTP_VERIFIED, data: { ...user, company, } });
  },
  forgotPasswordForMobile: async (req, res, next) => {
    const mobile = req.body.mobile;

    // find user
    const user = await userRepository.findOneByMobile(mobile);

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    const query = {
      value: mobile,
      isVerified: false,
      purpose: otpPurpose.FORGOT_PWD,
    }

    let otpObj = await otpRepository.findOtpByQuery(query);

    // generate random OTP code
    const otpCode = config.env === 'development' ? process.env.DEFAULT_OTP : generateOtp();

    if (otpObj) {
      // update the code
      otpObj.code = otpCode;
      await otpObj.save();
    } else {
      // save new otp
      otpObj = await otpRepository.saveOtp({
        mobile,
        code: otpCode,
        purpose: otpPurpose.FORGOT_PWD,
      });
    }

    return res.json({ statusCode: 200, message: successMessages.MOBILE_OTP_SENT });
    // send sms for OTP
  },
  forgotPasswordForEmail: async (req, res, next) => {
    const email = req.body.email;

    // find user
    const user = await userRepository.findOneByEmail(email);

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    const query = {
      value: email,
      isVerified: false,
      purpose: otpPurpose.FORGOT_PWD,
    }

    let otpObj = await otpRepository.findOtpByQuery(query);

    // generate random OTP code
    const otpCode = config.env === 'development' ? process.env.DEFAULT_OTP : generateOtp();

    if (otpObj) {
      // update the code
      otpObj.code = otpCode;
      await otpObj.save();
    } else {
      // save new otp
      otpObj = await otpRepository.saveOtp({
        email,
        code: otpCode,
        purpose: otpPurpose.FORGOT_PWD,
      });
    }

    return res.json({ statusCode: 200, message: successMessages.EMAIL_OTP_SENT });
    // send sms for OTP
  },
  resetPasswordForMobile: async (req, res, next) => {
    const mobile = req.body.mobile;
    const code = req.body.code;
    const password = req.body.password;

    // find user
    const user = await userRepository.findOneByMobile(mobile);

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    const query = {
      value: mobile,
      code,
      isVerified: false,
      purpose: otpPurpose.FORGOT_PWD,
    }

    let otpObj = await otpRepository.findOtpByQuery(query);

    if (!otpObj) {
      return next(createError(400, errorMessages.SOMETHING_WENT_WRONG));
    }

    // update the code
    otpObj.isVerified = true;
    await otpObj.save();

    // update user's password
    user.password = password;
    await user.save()

    return res.json({ statusCode: 200, message: successMessages.RESET_PWD });
  },
  resetPasswordForEmail: async (req, res, next) => {
    const email = req.body.email;
    const code = req.body.code;
    const password = req.body.password;

    // find user
    const user = await userRepository.findOneByEmail(email);

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    const query = {
      value: email,
      code,
      isVerified: false,
      purpose: otpPurpose.FORGOT_PWD,
    }

    let otpObj = await otpRepository.findOtpByQuery(query);

    if (!otpObj) {
      return next(createError(400, errorMessages.SOMETHING_WENT_WRONG));
    }

    // update the code
    otpObj.isVerified = true;
    await otpObj.save();

    // update user's password
    user.password = password;
    await user.save()

    return res.json({ statusCode: 200, message: successMessages.RESET_PWD });
  },
}