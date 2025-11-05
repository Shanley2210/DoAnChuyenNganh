const adminService = require('../services/admin.service');
const fs = require('fs');
const path = require('path');

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

const createUserController = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword, role } =
            req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword ||
            !role
        ) {
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

        const response = await adminService.createUserService(
            req.body,
            imageFilename
        );

        if (response.errCode !== 0) {
            fs.unlinkSync(
                path.join(__dirname, '../uploads/users', imageFilename)
            );
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createUser:', e);
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

const updateUserController = async (req, res) => {
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

        const response = await adminService.updateUserService(
            userId,
            data,
            imageFile
        );

        if (imageFile && response.errCode !== 0) {
            fs.unlinkSync(imageFile.path);
        }

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createUser:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const IdDel = req.params.id;

        if (!userId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await adminService.deleteUserService(userId, IdDel);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deleteUser:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getPatientsController = async (req, res) => {
    try {
        const response = await adminService.getPatientsService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getPatients:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
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

        if (imageFile && response.errCode !== 0) {
            fs.unlinkSync(imageFile.path);
        }

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

module.exports = {
    getUsersController,
    getUserByIdController,
    createHopistalAdminController,
    createUserController,
    updateUserController,
    deleteUserController,
    getPatientsController,
    createSpecialtyController,
    updateSpecialtyController,
    deleteSpecialtyController,
    createServiceController,
    updateServiceController,
    deleteServiceController,
    createScheduleController
};
