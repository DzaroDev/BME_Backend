const { Joi } = require('express-validation');
const { values } = require('lodash');
const { sortOrder, jobPostingStatus } = require('../constants');

const jobPostingStatusVals = values(jobPostingStatus);
const sortOrdersVals = values(sortOrder);

const schema = {
  jobPosting: {
    body: Joi.object({
      jobTitle: Joi.string().required(),
      hiringOrganization: Joi.object().unknown().allow(null),
      employmentType: Joi.string().required(),
      jobExperience: Joi.number().positive().allow(0).required(),
      jobLocation: Joi.string().required(),
      jobDescription: Joi.string().required(),
      jobImmediateStart: Joi.boolean().default(true),
      jobStartDate: Joi.date().raw().required(),
      industry: Joi.string().required(),
      skills: Joi.string().required(),
      salary: Joi.number().positive().allow(0).required(),
      totalJobOpenings: Joi.number().positive().integer().allow(0).required(),
    }),
  },
  jobPostingStatusUpdate: {
    body: Joi.object({
      jobPostId: Joi.string().required(),
      status: Joi.number().positive().integer().valid(...jobPostingStatusVals),
    }),
  },
  listJobPostings: {
    query: Joi.object().keys({
      pageNo: Joi.number().positive().integer(),
      pageSize: Joi.number().positive().integer(),
      jobPostingStatus: Joi.number().positive().integer().valid(...jobPostingStatusVals),
      sortBy: Joi.string(),
      sortOrder: Joi.number().valid(...sortOrdersVals),
    }).allow(null),
  },
}

module.exports = schema;
