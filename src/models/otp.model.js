const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  value: { type: String, required: true },
  code: { type: String, required: true },
  purpose: { type: String },
  isEmailType: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
});

module.exports = mongoose.model('otp', schema);
