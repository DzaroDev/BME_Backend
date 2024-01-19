const { isNumber, isString } = require('lodash');

const forumRepository = require('../repositories/forum.repository');
const userRepository = require('../repositories/user.repository');
const { companyUserTypes, nonCompanyUserTypes } = require('../constants');
const createError = require('../helpers/createError');
const { errorMessages } = require('../constants/textVariables');

module.exports = {
  getList: async (req, res, next) => {
    const queryOptions = {};
    const pageOptions = {};

    // setting keys
    if (isNumber(req.query.pageNo)) pageOptions.pageNo = req.query.pageNo;
    if (isNumber(req.query.pageSize)) pageOptions.pageSize = req.query.pageSize;
    if (isString(req.query.sortBy)) pageOptions.sortBy = req.query.sortBy;
    if (isNumber(req.query.sortOrder)) pageOptions.sortOrder = req.query.sortOrder;

    const posts = await forumRepository.findAll(queryOptions, pageOptions);
    pageOptions.totalRecords = (await forumRepository.findAll(queryOptions) || [])?.length;

    res.json({ statusCode: 200, data: { posts, ...pageOptions } });
  },
  createPost: async (req, res, next) => {
    let authUser = req.auth.user;
    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (![...companyUserTypes, ...nonCompanyUserTypes].includes(authUser?.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    const newPost = {
      content: req.body.content,
      attachments: req.body.attachments,
      author: authUser.id,
    }

    const post = await forumRepository.savePost(newPost);

    res.json({ statusCode: 200, data: post });
  },
  createPostComment: async (req, res, next) => {
    let authUser = req.auth.user;
    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (![...companyUserTypes, ...nonCompanyUserTypes].includes(authUser?.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let post = await forumRepository.findPostbyId(req.params.forumPostId);

    if (!post) {
      return next(createError(400, errorMessages.POST_DOES_NOT_EXIST));
    }

    const newComment = {
      content: req.body.content,
      author: authUser.id,
      post: post.id,
    }

    post = await forumRepository.savePostComment(post.id, newComment);

    res.json({ statusCode: 200, data: post });
  },
}