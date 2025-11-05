const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/all', doctorController.getDoctorsController);

router.get('/detail/:id', doctorController.getDoctorByIdController);

router.get(
    '/schedules',
    authMiddleware.verifyToken,
    authMiddleware.verifyDoctor,
    doctorController.getSchedulesController
);

router.get('/slots/:id', doctorController.getSlotsController);

module.exports = router;
