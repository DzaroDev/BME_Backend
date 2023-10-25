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

    const blogs = await blogRepository.findAllBlogsByUser(user);

    return res.json({ statusCode: 200, data: blogs });
  },
  createBlog: async (req, res, next) => {
    const inputBody = req.body;

    const user = await userRepository.findUserByQuery({ _id: inputBody.user });

    // assign required properties
    inputBody.user = req.auth.user;
    inputBody.username = user?.email;
    
    const blog = await blogRepository.saveblog(inputBody);

    return res.json({ statusCode: 200, data: blog });
  },
  updateBlog: async (req, res, next) => {
    const blogId = req.params.blogId;
    const inputBody = req.body;

    let blog = await blogRepository.findBlogById(blogId);

    if (!blog) {
      return next(createError(400, errorMessages.BLOG_DOES_NOT_EXIST));
    }

    const payload = {};

    if (inputBody.title) {
      payload.title = inputBody.title;
    }

    if (inputBody.content) {
      payload.content = inputBody.content;
    }

    if (inputBody.content) {
      payload.content = inputBody.content;
    }
    
    blog = await blogRepository.findAndUpdateBlogById(blogId, payload);

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
}