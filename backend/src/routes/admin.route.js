const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.get(
    '/users',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.getUsersController
);

router.get(
    '/users/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.getUserByIdController
);

router.post(
    '/hopistal-admin',
    authMiddleware.verifyToken,
    authMiddleware.verifySystemAdmin,
    adminController.createHopistalAdminController
);

router.post(
    '/users',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    uploadMiddleware.createUploadImgaeDir('users').single('image'),
    adminController.createUserController
);

router.put(
    '/users/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    uploadMiddleware.createUploadImgaeDir('users').single('image'),
    adminController.updateUserController
);

router.delete(
    '/users/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.deleteUserController
);

router.get(
    '/patients',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.getPatientsController
);

router.post(
    '/specialty',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    uploadMiddleware.createUploadImgaeDir('specialties').single('image'),
    adminController.createSpecialtyController
);

router.put(
    '/specialty/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    uploadMiddleware.createUploadImgaeDir('specialties').single('image'),
    adminController.updateSpecialtyController
);

router.delete(
    '/specialty/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.deleteSpecialtyController
);

router.post(
    '/services',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.createServiceController
);

router.put(
    '/services/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.updateServiceController
);

router.delete(
    '/services/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.deleteServiceController
);

router.post(
    '/schedules/:doctorId',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    adminController.createScheduleController
);



module.exports = router;
