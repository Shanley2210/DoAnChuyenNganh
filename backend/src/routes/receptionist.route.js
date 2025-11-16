// const express = require('express');
// const router = express.Router();

// const receptionistController = require('../controllers/receptionist.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

// router.put(
//     '/appointments/confirm/:id',
//     authMiddleware.verifyToken,
//     authMiddleware.verifyRole('Receptionist'),
//     authMiddleware.verifyPermission('comfirm_appointment'),
//     receptionistController.confirmAppointmentController
// );

// router.get(
//     '/appointments/today',
//     authMiddleware.verifyToken,
//     authMiddleware.verifyRole('Receptionist'),
//     receptionistController.getAppointmentsTodayController
// );

// module.exports = router;
