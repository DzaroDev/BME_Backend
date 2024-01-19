const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const forumSchema = require('../schema/forum.schema');
const forumController = require('../controllers/forum.controller');

const router = express.Router();

router.get('/all', async (req, res, next) => {
  try {
    const { value, error } = forumSchema.pagination.query.validate(req.query);
    
    if (error) return next(error);
    
    req.query = value;
    
    return await forumController.getList(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/:forumPostId/comment', validateJoiSchema(forumSchema.forumPostComment), async (req, res, next) => {
  try {
    return await forumController.createPostComment(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateJoiSchema(forumSchema.forumPost), async (req, res, next) => {
  try {
    return await forumController.createPost(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;