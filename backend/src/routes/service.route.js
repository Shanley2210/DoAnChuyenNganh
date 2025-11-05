const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service.controller');

router.get('/', serviceController.getServiceController);

module.exports = router;
