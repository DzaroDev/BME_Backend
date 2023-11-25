const { isNumber, isString } = require('lodash');
const { userTypes, blogStatusLabels, blogStatus, adminUserTypes } = require('../constants');
const { errorMessages, successMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const blogRepository = require('../repositories/blog.repository');
const userRepository = require('../repositories/user.repository');

module.exports = {
  getBlogById: async (req, res, next) => {
    const blogId = req.params.blogId;

    const blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }

    return res.json({ statusCode: 200, data: blog });
  },
  listAllBlogs: async (req, res, next) => {
    const queryOptions = {};
    const pageOptions = {};

    // setting keys
    if (isNumber(req.query.status)) queryOptions.status = req.query.status;
    if (isNumber(req.query.pageNo)) pageOptions.pageNo = req.query.pageNo;
    if (isNumber(req.query.pageSize)) pageOptions.pageSize = req.query.pageSize;
    if (isString(req.query.sortBy)) pageOptions.sortBy = req.query.sortBy;
    if (isNumber(req.query.sortOrder)) pageOptions.sortOrder = req.query.sortOrder;

    const blogs = await blogRepository.findAllBlogs(queryOptions, pageOptions);
    let totalRecords = await blogRepository.findAllBlogs(queryOptions);
    totalRecords = totalRecords?.length;

    const data = {
      blogs,
      ...pageOptions,
      totalRecords,
    }

    return res.json({ statusCode: 200, data });
  },
  createBlog: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    if (inputBody.status !== blogStatus.INCOMPLETE) {
      return next(createError(400, errorMessages.INVALID_STATUS));
    }

    // assign required properties
    inputBody.author = authUser.id;
    inputBody.statusLogs = [
      { status: blogStatusLabels[inputBody.status], date: new Date() }
    ];
    
    let blog = await blogRepository.saveBlog(inputBody);
    blog = blog.toJSON();
    blog.author = {
      name: authUser?.fullName,
      email: authUser?.email,
    }

    // delete unnecessary properties
    delete blog.statusLogs;

    return res.json({ statusCode: 200, data: blog });
  },
  updateBlog: async (req, res, next) => {
    const blogId = req.params.blogId;
    const inputBody = req.body;

    let blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }
    
    blog = await blogRepository.findAndUpdateBlogById(blogId, inputBody);

    return res.json({ statusCode: 200, data: blog });
  },
  deleteBlog: async (req, res, next) => {
    const blogId = req.params.blogId;

    let blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }

    const payload = {};
    payload.isDeleted = true;

    blog = await blogRepository.findAndUpdateBlogById(blogId, payload);

    return res.json({ statusCode: 200, message: successMessages.BLOG_DELETED });
  },
  updateBlogStatus: async (req, res, next) => {
    let authUser = req.auth.user;
    const { status, blogId } = req.body;
    let updateStatus = parseInt(status);

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (![userTypes.ADMIN, ...adminUserTypes].includes(authUser.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }
    
    if (
      blog.status === blogStatus.INCOMPLETE && updateStatus === blogStatus.APPROVED ||
      blog.status === blogStatus.APPROVED && updateStatus === blogStatus.PUBLISHED ||
      blog.status === blogStatus.PUBLISHED && updateStatus === blogStatus.UNPUBLISHED ||
      blog.status === blogStatus.UNPUBLISHED && updateStatus === blogStatus.PUBLISHED
    ) {
      const updateBlog = {};
      // update new status
      updateBlog.status = updateStatus;

      blog = await blogRepository.findAndUpdateBlogById(blogId, updateBlog);

      // update status logs
      blog.statusLogs.push({ status: blogStatusLabels[updateStatus], date: new Date });
      blog.save();

      return res.json({ statusCode: 200, data: blog });
    }

    // return error response
    return next(createError(400, errorMessages.INVALID_STATUS));
  },
}