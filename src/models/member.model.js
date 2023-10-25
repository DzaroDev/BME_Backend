const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  title: { type: String },
  description: { type: String },
  socialLinks: { type: Array },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('member', schema);
