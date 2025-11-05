const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get(
    '/detail/:id',
    authMiddleware.verifyToken,
    patientController.getDetailPatientController
);

router.post(
    '/',
    authMiddleware.verifyToken,
    patientController.createPatientController
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    patientController.updatePatientController
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    patientController.deletePatientController
);

module.exports = router;
