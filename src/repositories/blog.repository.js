const { size } = require('lodash');
const { pageConfigs } = require('../constants');
const blogModel = require('../models/blog.model');

const populateAuthorQuery = { path: 'author', select: 'firstName lastName email' };

module.exports = {
  getModelName: () => {
    return blogModel.modelName;
  },
  saveBlog: async (blog) => {
    blog = new blogModel(blog);
    return await blog.save();
  },
  findBlogById: async (blogId) => {
    const output = await blogModel.findOne({ _id: blogId, isDeleted: false }).populate(populateAuthorQuery);
    return output;
  },
  findAndUpdateBlogById: async (blogId, updateBlog) => {
    const output = await blogModel.findByIdAndUpdate(blogId, updateBlog, { new: true }).populate(populateAuthorQuery);
    return output;
  },
  findAllBlogsByUser: async (user) => {
    const output = await blogModel.find({ user, isDeleted: false });
    return output;
  },
  findAllBlogs: async (query, pageOptions) => {
    query = { ...query, isDeleted: false };
    if (size(pageOptions) > 1) {
      const {
        pageNo = pageConfigs.DEFAULT_PAGE,
        pageSize = pageConfigs.DEFAULT_PAGE_SIZE,
        sortBy = pageConfigs.DEFAULT_SORT_KEY,
        sortOrder = pageConfigs.DEFAULT_SORT_ORDER
      } = pageOptions;
      
      return await blogModel.find(query, '-statusLogs').populate(populateAuthorQuery)
        .limit(pageSize).skip((pageNo - 1) * pageSize).sort({ [sortBy]: sortOrder });
    }
    return await blogModel.find(query, '-statusLogs').populate(populateAuthorQuery);
  },
  findAllBlogsWithMinimalFields: async (query, pageOptions) => {
    query = { ...query, isDeleted: false };
    if (size(pageOptions) > 1) {
      const {
        pageNo = pageConfigs.DEFAULT_PAGE,
        pageSize = pageConfigs.DEFAULT_PAGE_SIZE,
        sortBy = pageConfigs.DEFAULT_SORT_KEY,
        sortOrder = pageConfigs.DEFAULT_SORT_ORDER
      } = pageOptions;
      
      return await blogModel.find(query)
        .select('id titleText images')
        .populate({
          path: 'author',
          select: 'firstName lastName'
        })
        .limit(pageSize).skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    }
    return await blogModel.find(query, '-statusLogs').populate(populateAuthorQuery);
  },
}
