const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  registrationId: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  mobileCode: { type: String },
  mobile: { type: String },
  email: { type: String },
  description: { type: String },
  logoImage: { type: String },
  brochureLink: { type: String },
  biomedicalExpertise: { type: String },
  documents: { type: Array },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('company', schema);
