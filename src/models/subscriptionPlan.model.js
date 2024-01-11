const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  durationDays: { type: Number, default: 30 },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('subscriptionplan', schema);
