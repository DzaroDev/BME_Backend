const { isNumber, isString } = require('lodash');
const mongoose = require('mongoose');
const { companyUserTypes, nonCompanyUserTypes, jobPostingStatus } = require('../constants');
const { errorMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const blogRepository = require('../repositories/blog.repository');
const userRepository = require('../repositories/user.repository');
const jobPostingRepository = require('../repositories/jobPosting.repository');

module.exports = {
  getBlogById: async (req, res, next) => {
    const blogId = req.params.blogId;

    const blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }

    return res.json({ statusCode: 200, data: blog });
  },
  listAllJobPostings: async (req, res, next) => {
    const queryOptions = {};
    const pageOptions = {};

    // setting keys
    if (isNumber(req.query.status)) queryOptions.status = req.query.status;
    if (isNumber(req.query.pageNo)) pageOptions.pageNo = req.query.pageNo;
    if (isNumber(req.query.pageSize)) pageOptions.pageSize = req.query.pageSize;
    if (isString(req.query.sortBy)) pageOptions.sortBy = req.query.sortBy;
    if (isNumber(req.query.sortOrder)) pageOptions.sortOrder = req.query.sortOrder;

    const jobPostings = await jobPostingRepository.findAllJobPostings(queryOptions, pageOptions);
    let totalRecords = await jobPostingRepository.findAllJobPostings(queryOptions);
    totalRecords = totalRecords?.length;

    const data = {
      jobPostings,
      ...pageOptions,
      totalRecords,
    }

    return res.json({ statusCode: 200, data });
  },
  createJobPosting: async (req, res, next) => {
    const jobPostingBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    // check if user type is valid
    if (![...companyUserTypes, ...nonCompanyUserTypes].includes(authUser.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    // assign required properties
    jobPostingBody.jobPostedBy = authUser.id;
    jobPostingBody.jobPostingStatus = jobPostingStatus.CREATED;
    
    let jobPosting = await jobPostingRepository.saveJobPost(jobPostingBody);
    jobPosting = jobPosting.toJSON();
    jobPosting.jobPostedBy = {
      name: authUser?.fullName,
      email: authUser?.email,
    };

    return res.json({ statusCode: 200, data: jobPosting });
  },
  jobPostingStatusUpdate: async (req, res, next) => {
    let authUser = req.auth.user;
    const { jobPostStatus, jobPostId } = req.body;
    let updateStatus = parseInt(jobPostStatus);

    if (!mongoose.Types.ObjectId.isValid(jobPostId)) {
      return next(createError(400, errorMessages.INVALID_OBJECT_ID));
    }

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    // check if user type is valid
    if (![...companyUserTypes, ...nonCompanyUserTypes].includes(authUser.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let jobPost = await jobPostingRepository.findJobPostingById(jobPostId);

    if (!jobPost) {
      return next(createError(400, errorMessages.JOB_POST_DOES_NOT_EXIST));
    }
    
    if (
      jobPost.jobPostingStatus === jobPostingStatus.CREATED && updateStatus === jobPostingStatus.PUBLISHED ||
      jobPost.jobPostingStatus === jobPostingStatus.PUBLISHED && updateStatus === jobPostingStatus.UNPUBLISHED ||
      jobPost.jobPostingStatus === jobPostingStatus.UNPUBLISHED && updateStatus === jobPostingStatus.PUBLISHED
    ) {
      const updateJobPost = {};
      // update new status
      updateJobPost.jobPostingStatus = updateStatus;
      jobPost = await jobPostingRepository.updateOneJobPosting(jobPostId, updateJobPost);

      return res.json({ statusCode: 200, data: jobPost });
    }

    // return error response
    return next(createError(400, errorMessages.INVALID_STATUS));
  },
}