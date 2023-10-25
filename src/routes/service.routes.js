const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const serviceSchema = require('../schema/service.schema');
const serviceController = require('../controllers/service.controller');

const router = express.Router();

router.post('/', validateJoiSchema(serviceSchema.service), async (req, res, next) => {
  try {
    return await serviceController.createService(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/:serviceId', validateJoiSchema(serviceSchema.service), async (req, res, next) => {
  try {
    return await serviceController.updateService(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;