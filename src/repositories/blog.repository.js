const blogModel = require('../models/blog.model');

module.exports = {
  saveblog: async (blog) => {
    blog.isActive = true; // active by default
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
}
