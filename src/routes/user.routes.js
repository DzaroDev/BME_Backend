const express = require('express');

// helpers
const validateJoiSchema = require('../helpers/validateJoiSchema');

// schema
const userSchema = require('../schema/user.schema');

// controllers
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    return await userController.getUserByToken(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/', validateJoiSchema(userSchema.updateUser), async (req, res, next) => {
  try {
    return await userController.updateUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/create', validateJoiSchema(userSchema.user), async (req, res, next) => {
  try {
    return await userController.createUser(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;