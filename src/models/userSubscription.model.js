const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'subscriptionplan' },
  subscriptionStartedAt: { type: Date },
  subscriptionExpiredAt: { type: Date },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('usersubscription', schema);
