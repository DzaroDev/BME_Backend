const config = require('../config');
const { errorMessages } = require('../constants/textVariables');
const getFileExtension = require('./getFileExtension');

/**
 * The file type and size validator for image and other documents
 * @param {*} file - any
 * @param {*} isImgOnly - boolean
 * @returns error message or none
 */
function validateFileUpload(file, isImgOnly) {
  if (!file || typeof isImgOnly !== 'boolean') return errorMessages.SOMETHING_WENT_WRONG;

  const fileExtn = getFileExtension(file.name);

  // validate image files
  if (isImgOnly) {
    const fileExtns = config.file.allowedImgFileTypes.split(',');
    
    if (!fileExtns.includes(fileExtn)) {
      return `Only ${fileExtns} images are allowed`;
    }

    if (file.size > config.file.allowedImgFileSize) {
      return `Image size should not be greater than ${Math.ceil(config.file.allowedImgFileSize/1024/1024)}MB`;
    }

    // continue
    return;
  }

  // validate document files
  const fileExtns = config.file.allowedDocFileTypes.split(',');
  
  if (!fileExtns.includes(fileExtn)) {
    return `Only ${fileExtns} documents are allowed`;
  }

  if (file.size > config.file.allowedDocFileSize) {
    return `Document size should not be greater than ${Math.ceil(config.file.allowedImgFileSize/1024/1024)}MB`;
  }

  // continue
  return;
}

module.exports = validateFileUpload;