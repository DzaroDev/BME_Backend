const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  relatedEntity: { type: String },
  relatedEntityId: { type: String },
  originalName: { type: String },
  mimeType: { type: String },
  size: { type: Number },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
});

// schema virtuals
schema.virtual('imageUrl').get(function() {
  return function(req) {
    return `https://${req.get('host')}/api/files/${this.id}`;
  };
});

module.exports = mongoose.model('file', schema);
