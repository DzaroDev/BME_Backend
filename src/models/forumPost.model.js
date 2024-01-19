const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  content: { type: String },
  attachments: [ { type: Object } ],
  comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'forumcomment' } ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('forumpost', schema);
