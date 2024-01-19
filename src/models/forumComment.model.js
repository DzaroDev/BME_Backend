const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  content: { type: String },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'forumpost' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  isDeleted: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('forumcomment', schema);
