const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const notificationSchema = require('../schema/notification.schema');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    return await notificationController.listAllNotifications(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateJoiSchema(notificationSchema.notification), async (req, res, next) => {
  try {
    return await notificationController.createNotification(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/all', validateJoiSchema(notificationSchema.updateNotification), async (req, res, next) => {
  try {
    return await notificationController.updateAllNotifications(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:notificationId', validateJoiSchema(notificationSchema.updateNotification), async (req, res, next) => {
  try {
    return await notificationController.updateNotification(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;