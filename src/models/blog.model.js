const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String },
  title: { type: String },
  content: { type: String },
  conclusion: { type: String },
  images: { type: Array },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('blog', schema);
