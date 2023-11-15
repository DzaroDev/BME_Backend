const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  activePeriod: { type: Number },
  subscriberCount: { type: Number },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
});

module.exports = mongoose.model('subscription', schema);
