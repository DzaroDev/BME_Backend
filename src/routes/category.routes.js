const express = require('express');

const categoryController = require('../controllers/category.controller');
const validateJoiSchema = require('../helpers/validateJoiSchema');
const categorySchema = require('../schema/category.schema');

const router = express.Router();

router.get('/all', async (req, res, next) => {
  try {
    return await categoryController.getList(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateJoiSchema(categorySchema.category), async (req, res, next) => {
  try {
    return await categoryController.createCategory(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:categoryId', validateJoiSchema(categorySchema.category), async (req, res, next) => {
  try {
    return await categoryController.updateCategory(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:categoryId', async (req, res, next) => {
  try {
    return await categoryController.deleteCategory(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;