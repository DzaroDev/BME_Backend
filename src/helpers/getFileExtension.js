const path = require('path');

function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

module.exports = getFileExtension;
