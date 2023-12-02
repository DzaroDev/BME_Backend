const mongoose = require('mongoose');

function validateObjectId(objectId) {
  if (!objectId) return false;
  return mongoose.Types.ObjectId.isValid(objectId);
}

module.exports = validateObjectId;