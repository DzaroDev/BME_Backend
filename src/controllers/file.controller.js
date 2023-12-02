const path = require('path');
const fs = require('fs');

//
const { errorMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const fileRepository = require('../repositories/file.repository');
const getFileExtension = require('../helpers/getFileExtension');
const validateObjectId = require('../helpers/validateObjectId');

module.exports = {
  sendFile: async (req, res, next) => {
    const fileId = req.params?.fileId;
    const isDocType = req.query?.isDoc;

    if (!validateObjectId(fileId)) {
      return next(createError(400, errorMessages.INVALID_OBJECT_ID));
    }

    const fileData = await fileRepository.findFileById(fileId);

    if (!fileData) {
      return next(createError(400, errorMessages.FILE_NOT_FOUND));
    }

    const fileName = fileData.id + getFileExtension(fileData.originalName);
    const filePath = path.join(
      __dirname,
      isDocType ? '../../public/docs' : '../../public/images',
      fileName
    );
    const fileStream = fs.createReadStream(filePath);
    
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `inline; filename=${fileData.id}`);
    
    fileStream.on('error', () => {
      res.setHeader('Content-Type', 'application/json');
      res.removeHeader('Content-Disposition');
      return next(createError(400, errorMessages.FILE_NOT_FOUND));
    });
    
    return fileStream.pipe(res);
  },
}