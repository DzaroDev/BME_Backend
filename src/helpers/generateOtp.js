const randomize = require('randomatic');

const generateOtp = () => {
  return randomize('000000');
}

module.exports = generateOtp;
