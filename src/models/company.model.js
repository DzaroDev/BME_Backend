const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  registrationNumber: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  mobile: { type: String },
  email: { type: String },
  description: { type: String },
  imageURL: { type: String },
  brochureFileURL: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('company', schema);
