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
const companyController = require('./company.controller');
const serviceController = require('./service.controller');
const subscriptionController = require('./subscription.controller');

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
  registerUserByMobile: async (req, res, next) => {
    const userInputBody = req.body.user;
    const companyInputBody = req.body?.company;
    const serviceInputBody = req.body?.service;

    let otpObj = await otpRepository.findOtpForMobileVerification(userInputBody?.mobile, otpPurpose.SIGN_UP);

    if (!otpObj || !otpObj?.isVerified) {
      return next(createError(400, errorMessages.MOBILE_NOT_VERIFIED));
    }

    let user = await userRepository.findUserByQuery({ mobile: userInputBody?.mobile });

    if (!user) {
      return next(createError(400, errorMessages.MOBILE_NOT_VERIFIED));
    }

    if (user?.isVerified) {
      return next(createError(400, errorMessages.USER_ALREADY_VERIFIED));
    }

    let newUser = {
      id: user.id,
      ...(userInputBody || {}),
    };
    let company = null;
    let companyService = null;
    let companyErrorMsg = null;
    let serviceErrorMsg = null;

    // company is optional
    if (companyInputBody) {
      await companyController.createCompanyWithRegisteredUser(newUser, companyInputBody, async (err, data) => {
        if (err) companyErrorMsg = err;
        company = data;
      });
      if (companyErrorMsg) return next(companyErrorMsg);
    }

    user = await userRepository.createVerifiedUser(newUser);
    user = user.toJSON();

    if (serviceInputBody) {
      serviceInputBody.companyId = company.id;
      await serviceController.createServiceWithRegisteredUser(newUser, serviceInputBody, async (err, data) => {
        if (err) serviceErrorMsg = err;
        companyService = data;
      });
      if (serviceErrorMsg) return next(serviceErrorMsg);
    }

    // create/sign token by user id
    const token = jwt.sign({ user: user.id }, config.jwtSecret);

    const subscription = await subscriptionController.applyPlanToVerifiedUser(user);

    res.json({ statusCode: 200, message: successMessages.USER_REGISTERED, data: { ...user, subscription, company, token } });
  },
  registerUserByEmail: async (req, res, next) => {
    const userInputBody = req.body.user;
    const companyInputBody = req.body?.company;
    const serviceInputBody = req.body?.service;

    let otpObj = await otpRepository.findOtpForMobileVerification(userInputBody?.email, otpPurpose.SIGN_UP);

    if (!otpObj || !otpObj?.isVerified) {
      return next(createError(400, errorMessages.EMAIL_NOT_VERIFIED));
    }

    let user = await userRepository.findUserByQuery({ email: userInputBody?.email });

    if (!user) {
      return next(createError(400, errorMessages.EMAIL_NOT_VERIFIED));
    }

    if (user?.isVerified) {
      return next(createError(400, errorMessages.USER_ALREADY_VERIFIED));
    }

    let newUser = {
      id: user.id,
      ...(userInputBody || {}),
    };
    let company = null;
    let companyService = null;
    let companyErrorMsg = null;
    let serviceErrorMsg = null;

    // company is optional
    if (companyInputBody) {
      await companyController.createCompanyWithRegisteredUser(newUser, companyInputBody, async (err, data) => {
        if (err) companyErrorMsg = err;
        company = data;
      });
      if (companyErrorMsg) return next(companyErrorMsg);
    }

    user = await userRepository.createVerifiedUser(newUser);
    user = user.toJSON();

    if (serviceInputBody) {
      serviceInputBody.companyId = company.id;
      await serviceController.createServiceWithRegisteredUser(newUser, serviceInputBody, async (err, data) => {
        if (err) serviceErrorMsg = err;
        companyService = data;
      });
      if (serviceErrorMsg) return next(serviceErrorMsg);
    }

    // create/sign token by user id
    const token = jwt.sign({ user: user.id }, config.jwtSecret);

    const subscription = await subscriptionController.applyPlanToVerifiedUser(user);

    res.json({ statusCode: 200, message: successMessages.USER_REGISTERED, data: { ...user, subscription, company, token } });
  },
  verifyMobileOtp: async (req, res, next) => {
    const { mobile, code } = req.body;

    let otpObj = await otpRepository.findOtpForMobileVerification(mobile, otpPurpose.SIGN_UP);

    if (!otpObj) {
      return next(createError(400, errorMessages.MOBILE_OTP_DOES_NOT_EXIST));
    }

    // check if OTP matches
    if (otpObj.code !== code) {
      return next(createError(400, errorMessages.OTP_DOES_NOT_MATCH));
    }

    // update OTP in db
    otpObj.isVerified = true;
    await otpObj.save();

    // check if user already exist
    let user = await userRepository.findUserByQuery({ mobile });

    // save user if not found
    if (!user) {
      user = {
        mobile,
      };
      user = await userRepository.saveUser(user);
    }

    res.json({ statusCode: 200, message: successMessages.MOBILE_OTP_VERIFIED });
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

    // check if OTP matches
    if (otpObj.code !== code) {
      return next(createError(400, errorMessages.OTP_DOES_NOT_MATCH));
    }

    // update OTP in db
    otpObj.isVerified = true;
    await otpObj.save();

    // check if user already exist
    let user = await userRepository.findUserByQuery({ email });

    // save user if not found
    if (!user) {
      user = {
        email,
      };
      user = await userRepository.saveUser(user);
    }

    res.json({ statusCode: 200, message: successMessages.EMAIL_OTP_VERIFIED });
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