const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const serviceSchema = require('../schema/service.schema');
const serviceController = require('../controllers/service.controller');

const router = express.Router();

router.get('/list', async (req, res, next) => {
  try {
    const { value, error } = serviceSchema.list.query.validate(req.query);
    if (error) return next(error);
    req.query = value;
    return await serviceController.listAllServices(req, res, next);
  } catch (error) {
    next(error);
  }
});

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