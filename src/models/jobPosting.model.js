const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  jobTitle: { type: String },
  hiringOrganization: { type: Object },
  employmentType: { type: String },
  jobExperience: { type: Number },
  jobLocation: { type: String },
  jobDescription: { type: String },
  jobImmediateStart: { type: Boolean },
  jobStartDate: { type: Date },
  industry: { type: String },
  skills: { type: String },
  salary: { type: Number },
  totalJobOpenings: { type: Number },
  jobPostingStatus: { type: Number },
  jobPostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  isDeleted: { type: Boolean, default: false },
}, {
  toObject: { useProjection: true },
  toJSON: { virtuals: true, getters: true, useProjection: true },
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('jobposting', schema);
