const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const jobPostSchema = require('../schema/jobPosting.schema');
const jobPostingController = require('../controllers/jobPosting.controller');

const router = express.Router();

router.get('/all', async (req, res, next) => {
  try {
    const { value, error } = jobPostSchema.listJobPostings.query.validate(req.query);
    if (error) return next(error);
    req.query = value;
    return await jobPostingController.listAllJobPostings(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/create', validateJoiSchema(jobPostSchema.jobPosting), async (req, res, next) => {
  try {
    return await jobPostingController.createJobPosting(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/status', validateJoiSchema(jobPostSchema.jobPostingStatusUpdate), async (req, res, next) => {
  try {
    return await jobPostingController.jobPostingStatusUpdate(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;