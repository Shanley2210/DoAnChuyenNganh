const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.post(
    '/hopistal-admin',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.createHopistalAdminController
);

router.get(
    '/roles',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.getRolesController
);

router.post(
    '/roles',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.createRoleController
);

router.delete(
    '/roles/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.deleteRoleController
);

router.get(
    '/permissions',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.getPermissionsController
);

router.post(
    '/permissions',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.createPermissionController
);

router.delete(
    '/permissions/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.deletePermissionController
);

router.get(
    '/user-permission',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.getUserPermissionController
);

router.post(
    '/user-permission',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.createUserPermissionController
);

router.delete(
    '/user-permission/:userId/:permissionId',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('System_Admin'),
    authMiddleware.verifyPermission('system_management'),
    adminController.deleteUserPermissionController
);

router.get(
    '/users',
    authMiddleware.verifyToken,
    authMiddleware.verifyRoles('System_Admin', 'Hospital_Admin'),
    authMiddleware.verifyPermission('user_view_all'),
    adminController.getUsersController
);

router.get(
    '/users/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRoles('System_Admin', 'Hospital_Admin'),
    authMiddleware.verifyPermission('view_user_detail'),
    adminController.getUserByIdController
);

router.delete(
    '/users/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRoles('System_Admin', 'Hospital_Admin'),
    authMiddleware.verifyPermission('user_manage_all'),
    adminController.deleteUserController
);

router.post(
    '/doctors',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('doctor_manage'),
    uploadMiddleware.createUploadImgaeDir('doctors').single('image'),
    adminController.createDoctorController
);

router.put(
    '/doctors/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('doctor_manage'),
    uploadMiddleware.createUploadImgaeDir('doctors').single('image'),
    adminController.updateDoctorController
);

router.post(
    '/receptionists',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('user_manage_all'),
    uploadMiddleware.createUploadImgaeDir('receptionists').single('image'),
    adminController.createReceptionistController
);

router.put(
    '/receptionists/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('user_manage_all'),
    uploadMiddleware.createUploadImgaeDir('receptionists').single('image'),
    adminController.updatereceptionistController
);

router.post(
    '/specialty',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('service_manage'),
    uploadMiddleware.createUploadImgaeDir('specialties').single('image'),
    adminController.createSpecialtyController
);

router.put(
    '/specialty/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('service_manage'),
    uploadMiddleware.createUploadImgaeDir('specialties').single('image'),
    adminController.updateSpecialtyController
);

router.delete(
    '/specialty/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('service_manage'),
    adminController.deleteSpecialtyController
);

router.post(
    '/services',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('service_manage'),
    adminController.createServiceController
);

router.put(
    '/services/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('service_manage'),
    adminController.updateServiceController
);

router.delete(
    '/services/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('service_manage'),
    adminController.deleteServiceController
);

router.get(
    '/schedules/:doctorId',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('doctor_schedule_manage'),
    adminController.getSchedulesController
);

router.post(
    '/schedules/:doctorId',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('doctor_schedule_manage'),
    adminController.createScheduleController
);

router.delete(
    '/schedules/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('doctor_schedule_manage'),
    adminController.deleteScheduleController
);

router.post(
    '/doctorprice/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('Hospital_Admin'),
    authMiddleware.verifyPermission('doctor_manage'),
    adminController.setPriceDoctorController
);

module.exports = router;
