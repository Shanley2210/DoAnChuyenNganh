const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/all', doctorController.getAllDoctorsController);

router.get('/detail/:id', doctorController.getDoctorByIdController);

router.get(
    '/schedules',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Doctor'),
    authMiddleware.verifyPermission('view_doctor_schedule'),
    doctorController.getSchedulesController
);

router.get('/slots/:id', doctorController.getSlotsController);

router.get('/specialty/:id', doctorController.getDoctorBySpecialtyController);

router.get(
    '/appointments',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Doctor'),
    authMiddleware.verifyPermission('view_doctor_appointment'),
    doctorController.getAppointmentsController
);

module.exports = router;
