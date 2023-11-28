const fileModel = require('../models/file.model');

module.exports = {
  saveFile: async (file) => {
    file = new fileModel(file);
    return await file.save();
  },
  findFileById: async (fileId) => {
    return await fileModel.findById(fileId);
  },
  findAndRemoveFileById: async (fileId) => {
    return await fileModel.findByIdAndRemove(fileId);
  }
}
