const adminService = require('../services/admin.service');
const fs = require('fs');
const path = require('path');

const createHopistalAdminController = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.createHopistalAdminService(
            name,
            email,
            phone,
            password,
            confirmPassword
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createHopistalAdmin:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getRolesController = async (req, res) => {
    try {
        const response = await adminService.getRolesService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getRoles:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createRoleController = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.createRoleService(
            name,
            description
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createRole:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteRoleController = async (req, res) => {
    try {
        const roleId = req.params.id;

        if (!roleId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deleteRoleService(roleId);

        return res.status(200).json(response);
        s;
    } catch (e) {
        console.log('Error in deleteRole:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getPermissionsController = async (req, res) => {
    try {
        const response = await adminService.getPermissionsService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getPermissions:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createPermissionController = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.createPermissionService(
            name,
            description
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createPermission:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deletePermissionController = async (req, res) => {
    try {
        const permissionId = req.params.id;

        if (!permissionId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deletePermissionService(
            permissionId
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deletePermission:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getUserPermissionController = async (req, res) => {
    try {
        const respone = await adminService.getUserPermissionService();

        return res.status(200).json(respone);
    } catch (e) {
        console.log('Error in getUserPermission:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createUserPermissionController = async (req, res) => {
    try {
        const { userId, permissionId } = req.body;

        if (!userId || !permissionId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const respone = await adminService.createUserPermissionService(
            userId,
            permissionId
        );

        return res.status(200).json(respone);
    } catch (e) {
        console.log('Error in createUserPermission:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteUserPermissionController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const permissionId = req.params.permissionId;

        if (!userId || !permissionId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const respone = await adminService.deleteUserPermissionService(
            userId,
            permissionId
        );

        return res.status(200).json(respone);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getUsersController = async (req, res) => {
    try {
        const response = await adminService.getUsersService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getUsers:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const getUserByIdController = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.getUserByIdService(userId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getUserById:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteUserController = async (req, res) => {
    try {
        const delId = req.params.id;

        if (!delId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deleteUserService(delId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deleteUser:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createDoctorController = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err)
                        console.error(
                            'Failed to cleanup uploaded file on error:',
                            err
                        );
                });
            }

            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        if (!req.file) {
            return res.status(200).json({
                errCode: 2,
                errMessage: 'Missing required image'
            });
        }

        const imageFilename = req.file.filename;

        const response = await adminService.createDoctorService(
            req.body,
            imageFilename
        );

        if (response.errCode !== 0) {
            fs.unlinkSync(
                path.join(__dirname, '../uploads/doctors', imageFilename)
            );
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createDoctor:', e);
        if (e.code === 'LIMIT_FILE_SIZE') {
            return res.status(200).json({
                errCode: -2,
                errMessage: 'File size exceeds the limit'
            });
        }

        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const updateDoctorController = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        const imageFile = req.file;

        if (!userId || !data) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.updateDoctorService(
            userId,
            data,
            imageFile
        );

        if (imageFile && response.errCode !== 0) {
            fs.unlinkSync(imageFile.path);
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in updateDoctor:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createReceptionistController = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err)
                        console.error(
                            'Failed to cleanup uploaded file on error:',
                            err
                        );
                });
            }

            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        if (!req.file) {
            return res.status(200).json({
                errCode: 2,
                errMessage: 'Missing required image'
            });
        }

        const imageFilename = req.file.filename;

        const response = await adminService.createReceptionistService(
            req.body,
            imageFilename
        );

        if (response.errCode !== 0) {
            fs.unlinkSync(
                path.join(__dirname, '../uploads/receptionists', imageFilename)
            );
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createReceptionist:', e);
        if (e.code === 'LIMIT_FILE_SIZE') {
            return res.status(200).json({
                errCode: -2,
                errMessage: 'File size exceeds the limit'
            });
        }

        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const updatereceptionistController = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        const imageFile = req.file;

        if (!userId || !data) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.updatereceptionistService(
            userId,
            data,
            imageFile
        );

        if (imageFile && response.errCode !== 0) {
            fs.unlinkSync(imageFile.path);
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in updateReceptionist:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createSpecialtyController = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !description || !status) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err)
                        console.error(
                            'Failed to cleanup uploaded file on error:',
                            err
                        );
                });
            }
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        if (!req.file) {
            return res.status(200).json({
                errCode: 2,
                errMessage: 'Missing required image'
            });
        }

        const imageFilename = req.file.filename;

        const response = await adminService.createSpecialtyService(
            name,
            description,
            imageFilename,
            status
        );

        if (response.errCode !== 0) {
            fs.unlinkSync(
                path.join(__dirname, '../uploads/specialties', imageFilename)
            );
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createSpecialty:', e);
        if (e.code === 'LIMIT_FILE_SIZE') {
            return res.status(200).json({
                errCode: -2,
                errMessage: 'File size exceeds the limit'
            });
        }
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const updateSpecialtyController = async (req, res) => {
    try {
        const specialtyId = req.params.id;
        const data = req.body;
        const imageFile = req.file;

        if (!specialtyId || !data) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.updateSpecialtyService(
            specialtyId,
            data,
            imageFile
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in updateSpecialty:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteSpecialtyController = async (req, res) => {
    try {
        const specialtyId = req.params.id;

        if (!specialtyId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deleteSpecialtyService(specialtyId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deleteSpecialty:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createServiceController = async (req, res) => {
    try {
        const { name, description, durationMinutes, price, status } = req.body;

        if (!name || !description || !durationMinutes || !price || !status) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.createServiceService(
            name,
            description,
            durationMinutes,
            price,
            status
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createService:', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const updateServiceController = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const data = req.body;

        if (!serviceId || !data) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.updateServiceService(
            serviceId,
            data
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in updateService:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteServiceController = async (req, res) => {
    try {
        const serviceId = req.params.id;

        if (!serviceId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deleteServiceService(serviceId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deleteService:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getSchedulesController = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.getSchedulesService(doctorId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getSchedules:', e);
    }
};

const createScheduleController = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const { name, workDate, shift, status } = req.body;

        if (!doctorId || !name || !workDate || !shift || !status) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.createScheduleAndSlotService(
            doctorId,
            name,
            workDate,
            shift,
            status
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createSchedule:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteScheduleController = async (req, res) => {
    try {
        const scheduleId = req.params.id;

        if (!scheduleId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deleteScheduleService(scheduleId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deleteSchedule:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
    s;
};

const setPriceDoctorController = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const { price } = req.body;

        if (!doctorId || !price) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.setPriceDoctorService(
            doctorId,
            price
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in setPrice:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = {
    createHopistalAdminController,
    getRolesController,
    createRoleController,
    deleteRoleController,
    getPermissionsController,
    createPermissionController,
    deletePermissionController,
    getUserPermissionController,
    createUserPermissionController,
    deleteUserPermissionController,
    getUsersController,
    getUserByIdController,
    deleteUserController,
    createDoctorController,
    updateDoctorController,
    createReceptionistController,
    updatereceptionistController,
    createSpecialtyController,
    updateSpecialtyController,
    deleteSpecialtyController,
    createServiceController,
    updateServiceController,
    deleteServiceController,
    createScheduleController,
    deleteScheduleController,
    getSchedulesController,
    setPriceDoctorController
};
