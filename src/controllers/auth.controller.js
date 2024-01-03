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
// const generateTemplate = require('../helpers/generateTemplate');
// const sendMail = require('../helpers/sendMail');

// repositories
const otpRepository = require('../repositories/otp.repository');
const userRepository = require('../repositories/user.repository');

module.exports = {
  sendOtpForMobileRegister: async (req, res, next) => {
    const mobile = req.body.mobile;
    
    let otpObj = await otpRepository.findOtpByMobile(mobile);
    
    // check if already verified
    if (otpObj?.isVerified) {
      return next(createError(400, errorMessages.MOBILE_ALREADY_VERIFIED));
    }

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
        purpose: otpPurpose.SIGN_UP,
      });
    }

    return res.json({ statusCode: 200, message: successMessages.MOBILE_OTP_SENT });
    // send sms for OTP
  },
  verifyMobileOtp: async (req, res, next) => {
    const { mobile, code } = req.body;

    let otpObj = await otpRepository.findOtpForMobileVerification(mobile, otpPurpose.SIGN_UP);

    if (!otpObj) {
      return next(createError(400, errorMessages.MOBILE_OTP_DOES_NOT_EXIST));
    }

    // check if already verified
    if (otpObj.isVerified) {
      return next(createError(400, errorMessages.MOBILE_ALREADY_VERIFIED));
    }

    // check if OTP matches
    if (otpObj.code !== code) {
      return next(createError(400, errorMessages.OTP_DOES_NOT_MATCH));
    }

    // update OTP in db
    otpObj.isVerified = true;
    await otpObj.save();

    // save user with unknown type
    const user = {
      mobile: mobile,
      password: generateRandomPwd(),
    };
    await userRepository.saveUser(user);

    res.json({  statusCode: 200, message: successMessages.MOBILE_OTP_VERIFIED });
  },
  sendOtpForEmailRegister: async (req, res, next) => {
    const email = req.body.email;
    
    let otpObj = await otpRepository.findOtpByEmail(email);
    
    // check if already verified
    if (otpObj?.isVerified) {
      return next(createError(400, errorMessages.EMAIL_ALREADY_VERIFIED));
    }

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
        purpose: otpPurpose.SIGN_UP,
      });
    }

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
    if (otpObj.isVerified) {
      return next(createError(400, errorMessages.EMAIL_ALREADY_VERIFIED));
    }

    // check if OTP matches
    if (otpObj.code !== code) {
      return next(createError(400, errorMessages.OTP_DOES_NOT_MATCH));
    }

    // update OTP in db
    otpObj.isVerified = true;
    await otpObj.save();

    // save user with unknown type
    const user = {
      email: email,
      password: generateRandomPwd(),
    };
    await userRepository.saveUser(user);

    res.json({ statusCode: 200, message: successMessages.EMAIL_OTP_VERIFIED });
  },
}