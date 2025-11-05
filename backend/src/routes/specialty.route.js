const express = require('express');
const router = express.Router();

const specialtyController = require('../controllers/specialty.controller');

router.get('/', specialtyController.getSpecialtyController);

module.exports = router;
