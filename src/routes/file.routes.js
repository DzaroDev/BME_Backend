const express = require('express');

const router = express.Router();

const fileController = require('../controllers/file.controller');

router.get('/:fileId', async (req, res, next) => {
  try {
    return await fileController.sendFile(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;