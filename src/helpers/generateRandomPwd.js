const randomize = require('randomatic');

const generateRandomPwd = () => {
  return randomize('Aa0!', 8);
}

module.exports = generateRandomPwd;
