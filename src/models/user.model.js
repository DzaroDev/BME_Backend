const mongoose = require('mongoose');
const { values } = require('lodash');
const bcrypt = require('bcrypt');

// constants
const SALT_WORK_FACTOR = 10;
const { userTypes } = require('../constants');

const schema = new mongoose.Schema({
  userType: { type: Number, enum: values(userTypes) },
  category: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  mobileCode: { type: String },
  mobile: { type: String },
  email: { type: String },
  password: { type: String, select: false },
  city: { type: String },
  company: { type: String },
  institute: { type: String },
  website: { type: String },
  preferences: {
    pushNotification: { type: Boolean, default: true },
  },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

// schema indexes
schema.index({ email: 1, phone: 1, userType: 1 });

// pre hooks
schema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// custom methods
schema.methods.comparePassword = async function(inputPassword, cb) {
  const userModel = mongoose.model('user', schema);
  const user = await userModel.findById(this._id).select('+password');
  if (!user) return false;
  return bcrypt.compare(inputPassword, user.password);
};

// schema virtuals
schema.virtual('fullName').get(function() {
  if (!this.lastName) return this.firstName;
  if (this.lastName) return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('user', schema);
