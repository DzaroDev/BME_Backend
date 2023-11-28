const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  relatedEntity: { type: String },
  relatedEntityId: { type: String },
  purpose: { type: String },
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
    return `${req.protocol}://${req.get('host')}/api/files/${this.id}`;
  };
});

module.exports = mongoose.model('file', schema);
