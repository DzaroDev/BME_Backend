const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

//
const { errorMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const fileRepository = require('../repositories/file.repository');
const getFileExtension = require('../helpers/getFileExtension');

module.exports = {
  sendFile: async (req, res, next) => {
    const fileId = req.params?.fileId;

    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      return next(createError(400, errorMessages.SOMETHING_WENT_WRONG));
    }

    const file = await fileRepository.findFileById(fileId);

    if (!file) {
      return next(createError(400, errorMessages.FILE_NOT_FOUND));
    }

    const fileName = file.id + getFileExtension(file.originalName);
    const filePath = path.join(__dirname, '../../public/images', fileName);
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('data', () => {
      res.setHeader('Content-Type', file.mimeType);
      res.setHeader('Content-Disposition', `inline; filename=${file.id}`);
    });
    
    fileStream.on('error', () => {
      return next(createError(400, errorMessages.FILE_NOT_FOUND));
    });
    
    return fileStream.pipe(res);
  },
}