const { size } = require('lodash');
const jobPostModel = require('../models/jobPosting.model');
const { pageConfigs } = require('../constants');

const populateJobPostedByQuery = { path: 'jobPostedBy', select: 'firstName lastName email' };

module.exports = {
  getModelName: () => {
    return jobPostModel.modelName;
  },
  updateOneJobPosting: async (jobPostId, updateJobPost) => {
    return await jobPostModel
      .findByIdAndUpdate(jobPostId, updateJobPost, { new: true })
      .populate(populateJobPostedByQuery);
  },
  findJobPostingById: async (jobPostingId) => {
    return await jobPostModel
      .findOne({ _id: jobPostingId, isDeleted: false })
      .populate(populateJobPostedByQuery);
  },
  findAllJobPostings: async (query, pageOptions) => {
    query = { ...query, isDeleted: false };
    if (size(pageOptions) > 1) {
      const {
        pageNo = pageConfigs.DEFAULT_PAGE,
        pageSize = pageConfigs.DEFAULT_PAGE_SIZE,
        sortBy = pageConfigs.DEFAULT_SORT_KEY,
        sortOrder = pageConfigs.DEFAULT_SORT_ORDER
      } = pageOptions;
      
      return await jobPostModel
        .find(query)
        .populate(populateJobPostedByQuery)
        .limit(pageSize)
        .skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    }
    return await jobPostModel.find(query).populate(populateJobPostedByQuery);
  },
  saveJobPost: async (jobPost) => {
    jobPost = new jobPostModel(jobPost);
    return await jobPost.save();
  },
}
