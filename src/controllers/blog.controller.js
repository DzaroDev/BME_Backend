const { userTypes } = require('../constants');
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
  getAllBlogs: async (req, res, next) => {
    const user = req.auth.user;

    const pagination = {
      pageNo: req.query.pageNo,
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      status: req.query.status,
    }

    const blogs = await blogRepository.findAllBlogs({ status: pagination.status }, pagination);

    return res.json({ statusCode: 200, data: blogs });
  },
  createBlog: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400));
    }

    // assign required properties
    inputBody.user = authUser.id;
    inputBody.username = authUser.email;
    
    const blog = await blogRepository.saveBlog(inputBody);

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
  statusUpdateBlog: async (req, res, next) => {
    const inputBody = req.body;
    const blogId = req.params.blogId;

    let blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }

    const updateBlog = {};
    updateBlog.status = inputBody.status;

    blog = await blogRepository.findAndUpdateBlogById(blogId, updateBlog);

    return res.json({ statusCode: 200, data: blog });
  },
}