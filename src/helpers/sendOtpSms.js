const SendOtp = require('sendotp');
const debug = require('debug')('node-server:index');

const config = require('../config');

function sendOtpSms({ mobile, otpCode }) {
  if (!config?.msg91AuthKey || !config?.msg91SenderId) return
  const sendOtp = new SendOtp(config.msg91AuthKey);
  sendOtp.send(mobile, config.msg91SenderId, otpCode, function (error, data) {
    debug('MSG91 OTP sent!', data);
  });
}

module.exports = sendOtpSms;