const express = require('express');
const pageContentController = require('../controllers/pageContent.controller');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    return await pageContentController.getPageContent(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;