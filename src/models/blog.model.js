const { values } = require('lodash');
const mongoose = require('mongoose');
const { blogStatus } = require('../constants');

const schema = new mongoose.Schema({
  titleText: { type: String },
  mainText: { type: String },
  summaryText: { type: String },
  category: { type: String },
  images: { type: Array },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: Number, enums: values(blogStatus) },
  statusLogs: { type: Array },
  isDeleted: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('blog', schema);
