const { values } = require('lodash');
const mongoose = require('mongoose');
const { blogStatus } = require('../constants');

const schema = new mongoose.Schema({
  username: { type: String },
  title: { type: String },
  content: { type: String },
  conclusion: { type: String },
  images: { type: Array },
  isDeleted: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: Number, enums: values(blogStatus) },
  publishedAt: { type: Date },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('blog', schema);
