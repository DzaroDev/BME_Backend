const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  description1: { type: String },
  description2: { type: String },
  modelName: { type: String },
  specification: { type: String },
  category: { type: String },
  price: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('service', schema);
