const { blogStatus } = require('../constants');
const blogModel = require('../models/blog.model');

module.exports = {
  saveBlog: async (blog) => {
    blog.status = blogStatus.INCOMPLETE;
    blog = new blogModel(blog);
    return await blog.save();
  },
  findBlogById: async (blogId) => {
    const output = await blogModel.findOne({ _id: blogId, isDeleted: false });
    return output;
  },
  findAndUpdateBlogById: async (blogId, updateBlog) => {
    const output = await blogModel.findByIdAndUpdate(blogId, updateBlog, { new: true });
    return output;
  },
  findAllBlogsByUser: async (user) => {
    const output = await blogModel.find({ user, isDeleted: false });
    return output;
  },
  findAllBlogs: async (query, pagination) => {
    query = { ...query, isDeleted: false };
    let output = null;
    if (pagination) {
      const { pageNo, pageSize, sortBy, sortOrder } = pagination;
      output = await blogModel.find(query)
        .limit(pageSize)
        .skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    } else {
      output = await blogModel.find(query);
    }
    return output;
  },
}
