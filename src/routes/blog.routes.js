const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const blogSchema = require('../schema/blog.schema');
const blogController = require('../controllers/blog.controller');

const router = express.Router();

router.get('/all', async (req, res, next) => {
  try {
    return await blogController.getAllBlogs(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:blogId', async (req, res, next) => {
  try {
    return await blogController.getBlogById(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateJoiSchema(blogSchema.blog), async (req, res, next) => {
  try {
    return await blogController.createBlog(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:blogId', validateJoiSchema(blogSchema.updateBlog), async (req, res, next) => {
  try {
    return await blogController.updateBlog(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:blogId', async (req, res, next) => {
  try {
    return await blogController.deleteBlog(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;