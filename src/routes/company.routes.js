const express = require('express');

const validateJoiSchema = require('../helpers/validateJoiSchema');
const companyController = require('../controllers/company.controller');
const companySchema = require('../schema/company.schema');

const router = express.Router();

router.get('/list', async (req, res, next) => {
  try {
    const { value, error } = companySchema.listCompany.query.validate(req.query);
    if (error) return next(error);
    req.query = value;
    return await companyController.listAllCompanies(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:companyId', async (req, res, next) => {
  try {
    return await companyController.getCompanyById(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/status-update', validateJoiSchema(companySchema.updateCompanyStatus), async (req, res, next) => {
  try {
    return await companyController.updateCompanyStatus(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateJoiSchema(companySchema.company), async (req, res, next) => {
  try {
    return await companyController.createCompany(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/student-company', validateJoiSchema(companySchema.studentCompany), async (req, res, next) => {
  try {
    return await companyController.createStudentCompany(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:companyId', validateJoiSchema(companySchema.updateCompany), async (req, res, next) => {
  try {
    return await companyController.updateCompany(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/logo-image', validateJoiSchema(companySchema.uploadLogoImage), async (req, res, next) => {
  try {
    return await companyController.uploadLogoImage(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/document-uploads', validateJoiSchema(companySchema.uploadLogoImage), async (req, res, next) => {
  try {
    return await companyController.uploadDocuments(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;