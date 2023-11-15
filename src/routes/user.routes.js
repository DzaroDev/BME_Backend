const express = require('express');

// helpers
const validateJoiSchema = require('../helpers/validateJoiSchema');

// schema
const userSchema = require('../schema/user.schema');

// controllers
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/all', async (req, res, next) => {
  try {
    const { value, error } = userSchema.listUsers.query.validate(req.query);
    if (error) return next(error);
    req.query = value;
    return await userController.listAllUsers(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    return await userController.getUserByToken(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/', validateJoiSchema(userSchema.updateUser), async (req, res, next) => {
  try {
    return await userController.updateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/create', validateJoiSchema(userSchema.user), async (req, res, next) => {
  try {
    return await userController.createUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/:userId/profile', validateJoiSchema(userSchema.userProfile), async (req, res, next) => {
  try {
    return await userController.updateUserProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/:userId/admin-profile', validateJoiSchema(userSchema.updateAdminUser), async (req, res, next) => {
  try {
    return await userController.updateAdminUserProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;