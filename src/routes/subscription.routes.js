const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const subscriptionController = require('../controllers/subscription.controller');
const subscriptionSchema = require('../schema/subscription.schema');

const router = express.Router();

router.post('/plan', validateJoiSchema(subscriptionSchema.plan), async (req, res, next) => {
  try {
    return await subscriptionController.createSubscriptionPlan(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/plan/:planId', validateJoiSchema(subscriptionSchema.updatePlan), async (req, res, next) => {
  try {
    return await subscriptionController.updateSubscriptionPlan(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/plans', async (req, res, next) => {
  try {
    return await subscriptionController.getSubscriptionPlans(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;