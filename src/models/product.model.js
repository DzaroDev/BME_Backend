const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  description1: { type: String },
  description2: { type: String }, // one liner description
  modelName: { type: String },
  specification: { type: String },
  category: { type: String },
  price: { type: String },
  imageURL: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
});

module.exports = mongoose.model('product', schema);
