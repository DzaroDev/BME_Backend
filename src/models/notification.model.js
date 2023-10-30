const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String },
  body: { type: String },
  notifyType: { type: String },
  isRead: { type: Boolean, default: false },
  receivedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  sentByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('notification', schema);
