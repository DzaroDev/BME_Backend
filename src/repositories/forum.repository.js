const { size } = require('lodash');
const { pageConfigs } = require('../constants');
const forumPostModel = require('../models/forumPost.model');
const forumCommentModel = require('../models/forumComment.model');

const populateAuthorQuery = { path: 'author', select: 'firstName lastName email mobile' };
const populateCommentsQuery = { path: 'comments', select: 'content author createdAt updatedAt', populate: populateAuthorQuery, options: { sort: { createdAt: -1 } } };

module.exports = {
  findAll: async (query, pageOptions) => {
    query = { ...query, isDeleted: false };
    
    if (size(pageOptions) > 1) {
      const {
        pageNo = pageConfigs.DEFAULT_PAGE,
        pageSize = pageConfigs.DEFAULT_PAGE_SIZE,
        sortBy = pageConfigs.DEFAULT_SORT_KEY,
        sortOrder = pageConfigs.DEFAULT_SORT_ORDER
      } = pageOptions;
      
      return await forumPostModel
        .find(query)
        .populate(populateAuthorQuery)
        .populate(populateCommentsQuery)
        .limit(pageSize)
        .skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    }
    return await forumPostModel.find(query).populate(populateAuthorQuery).populate(populateCommentsQuery);
  },
  savePost: async (post) => {
    post = new forumPostModel(post);
    return await post.save();
  },
  savePostComment: async (postId, comment) => {
    comment = await new forumCommentModel(comment).save();
    const post = await forumPostModel
      .findByIdAndUpdate(postId, { $push: { comments: comment.id } }, { new: true })
      .populate(populateCommentsQuery);
    return post;
  },
  findPostbyId: async (postId) => {
    return await forumPostModel.findById(postId);
  }
}
