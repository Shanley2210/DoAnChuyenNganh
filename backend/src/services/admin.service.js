const { Op } = require('sequelize');
const db = require('../models');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { lock } = require('../routes/admin.route');

const getShiftTime = (shift) => {
    switch (shift) {
        case 'C1':
            return { startHour: 8, endHour: 12 };
        case 'C2':
            return { startHour: 13, endHour: 17 };
        case 'C3':
            return { startHour: 18, endHour: 22 };
        default:
            return null;
    }
};

const getUsersService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                oder: [
                    ['role', 'ASC'],
                    ['name', 'ASC']
                ],
                attributes: {
                    exclude: ['password', 'otp', 'otpExpires', 'refreshToken']
                }
            });

            return resolve({
                errCode: 0,
                message: 'Get users successful',
                data: users
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const getUserByIdService = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ['password', 'otp', 'otpExpires', 'refreshToken']
                },
                include: [
                    {
                        model: db.Patient,
                        as: 'patient',
                        attributes: {
                            exclude: ['id', 'userId']
                        }
                    },
                    {
                        model: db.Doctor,
                        as: 'doctor',
                        attributes: {
                            exclude: ['id', 'userId']
                        }
                    },
                    {
                        model: db.Admin,
                        as: 'admin',
                        attributes: {
                            exclude: ['id', 'userId']
                        }
                    },
                    {
                        model: db.Receptionist,
                        as: 'receptionist',
                        attributes: {
                            exclude: ['id', 'userId']
                        }
                    }
                ]
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get user successful',
                data: user
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const createHopistalAdminService = (
    name,
    email,
    phone,
    password,
    confirmPassword
) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();

        try {
            if (password !== confirmPassword) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Password and confirm password do not match'
                });
            }

            const existingVerifiedUser = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: email }, { phone: phone }]
                }
            });

            if (existingVerifiedUser) {
                await trans.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: 'Email or phone number already in use'
                });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await db.User.create(
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashPassword,
                    verify: true,
                    role: 'admin',
                    otp: null,
                    otpExpires: null,
                    refreshToken: null
                },
                { transaction: trans }
            );
            await db.Admin.create(
                {
                    userId: newUser.id,
                    roleType: 'hopistal'
                },
                { transaction: trans }
            );

            await trans.commit();

            return resolve({
                errCode: 0,
                message: 'Create hopistal admin successful'
            });
        } catch (e) {
            await trans.rollback();
            return reject(e);
        }
    });
};

const createUserService = (data, imageFilename) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();
        const { name, email, phone, password, confirmPassword, role } = data;

        try {
            if (password !== confirmPassword) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Password and confirm password do not match'
                });
            }

            const existingVerifiedUser = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: email }, { phone: phone }]
                }
            });

            if (existingVerifiedUser) {
                await trans.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: 'Email or phone number already in use'
                });
            }

            const imagePath = path
                .join('/uploads', 'users', imageFilename)
                .replace(/\\/g, '/');

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await db.User.create(
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashPassword,
                    verify: true,
                    role: role,
                    otp: null,
                    otpExpires: null,
                    refreshToken: null
                },
                { transaction: trans }
            );

            if (role === 'doctor') {
                const { specialtyId, room } = data;

                if (!specialtyId || !room) {
                    await trans.rollback();
                    return resolve({
                        errCode: 1,
                        errMessage: 'Missing required parameters'
                    });
                }

                await db.Doctor.create(
                    {
                        userId: newUser.id,
                        specialtyId: specialtyId,
                        room: room,
                        image: imagePath,
                        status: 'active'
                    },
                    { transaction: trans }
                );
            } else if (role === 'receptionist') {
                await db.Receptionist.create(
                    {
                        userId: newUser.id,
                        image: imagePath,
                        status: 'active'
                    },
                    { transaction: trans }
                );
            }

            await trans.commit();

            return resolve({
                errCode: 0,
                message: `Create ${role} successful`
            });
        } catch (e) {
            trans.rollback();
            return reject(e);
        }
    });
};

const updateUserService = (userId, data, imageFile) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();

        try {
            const user = await db.User.findOne({
                where: { id: userId },
                transaction: trans
            });

            if (!user) {
                await trans.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            if (data.email && data.email !== user.email) {
                const existingUser = await db.User.findOne({
                    where: { email: data.email, id: { [Op.ne]: userId } },
                    transaction: trans
                });
                if (existingUser) {
                    await trans.rollback();
                    return resolve({
                        errCode: 3,
                        errMessage: 'Email already in use'
                    });
                }
            }
            if (data.phone && data.phone !== user.phone) {
                const existingUser = await db.User.findOne({
                    where: { phone: data.phone, id: { [Op.ne]: userId } },
                    transaction: trans
                });
                if (existingUser) {
                    await trans.rollback();
                    return resolve({
                        errCode: 4,
                        errMessage: 'Phone number already in use'
                    });
                }
            }

            const userData = {};
            if (data.name !== undefined) {
                userData.name = data.name;
            }
            if (data.email !== undefined) {
                userData.email = data.email;
            }
            if (data.phone !== undefined) {
                userData.phone = data.phone;
            }

            await db.User.update(userData, {
                where: { id: userId },
                transaction: trans
            });

            if (user.role === 'doctor') {
                const doctor = await db.Doctor.findOne({
                    where: { userId: userId },
                    transaction: trans
                });

                const oldImagePath = doctor.image;

                const doctorData = {};
                if (data.specialtyId !== undefined)
                    doctorData.specialtyId = data.specialtyId;
                if (data.room !== undefined) doctorData.room = data.room;
                if (data.status !== undefined) doctorData.status = data.status;
                if (imageFile !== undefined)
                    doctorData.image = path
                        .join('/uploads', 'doctors', imageFile.filename)
                        .replace(/\\/g, '/');

                if (Object.keys(doctorData).length > 0) {
                    await db.Doctor.update(doctorData, {
                        where: { userId: userId },
                        transaction: trans
                    });
                }

                if (imageFile && oldImagePath) {
                    const fullOldImagePath = path.join(
                        __dirname,
                        '..',
                        oldImagePath
                    );
                    if (fs.existsSync(fullOldImagePath)) {
                        fs.unlinkSync(fullOldImagePath);
                    }
                }
            } else if (user.role === 'receptionist') {
                const receptionist = await db.Receptionist.findOne({
                    where: { userId: userId },
                    transaction: trans
                });

                const oldImagePath = receptionist.image;

                const receptionistData = {};
                if (data.status !== undefined)
                    receptionistData.status = data.status;
                if (imageFile !== undefined)
                    receptionistData.image = path
                        .join('/uploads', 'receptionists', imageFile.filename)
                        .replace(/\\/g, '/');

                if (Object.keys(receptionistData).length > 0) {
                    await db.Receptionist.update(receptionistData, {
                        where: { userId: userId },
                        transaction: trans
                    });
                }

                if (imageFile && oldImagePath) {
                    const fullOldImagePath = path.join(
                        __dirname,
                        '..',
                        oldImagePath
                    );
                    if (fs.existsSync(fullOldImagePath)) {
                        fs.unlinkSync(fullOldImagePath);
                    }
                }
            }

            await trans.commit();

            return resolve({
                errCode: 0,
                message: 'Update user successful'
            });
        } catch (e) {
            trans.rollback();
            return reject(e);
        }
    });
};

const deleteUserService = (userId, IdDel) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();

        try {
            const userDel = await db.User.findOne({
                where: { id: IdDel },
                transaction: trans
            });

            if (!userDel) {
                await trans.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            const RoleDel = userDel.role;

            if (RoleDel === 'admin') {
                const sysAdmin = await db.Admin.findOne({
                    where: { userId: userId },
                    transaction: trans
                });

                if (!sysAdmin || sysAdmin.roleType !== 'system') {
                    await trans.rollback();
                    return resolve({
                        errCode: 3,
                        errMessage: "You don't have permission to delete this"
                    });
                }
            }

            if (RoleDel === 'doctor') {
                const doctor = await db.Doctor.findOne({
                    where: { userId: IdDel },
                    transaction: trans
                });

                const oldImagePath = doctor.image;

                await db.Doctor.destroy({
                    where: { userId: IdDel },
                    transaction: trans
                });

                const fullOldImagePath = path.join(
                    __dirname,
                    '..',
                    oldImagePath
                );
                if (fs.existsSync(fullOldImagePath)) {
                    fs.unlinkSync(fullOldImagePath);
                }
            } else if (RoleDel === 'receptionist') {
                const receptionist = await db.Receptionist.findOne({
                    where: { userId: IdDel },
                    transaction: trans
                });

                const oldImagePath = receptionist.image;

                await db.Receptionist.destroy({
                    where: { userId: IdDel },
                    transaction: trans
                });

                const fullOldImagePath = path.join(
                    __dirname,
                    '..',
                    oldImagePath
                );
                if (fs.existsSync(fullOldImagePath)) {
                    fs.unlinkSync(fullOldImagePath);
                }
            } else if (RoleDel === 'patient') {
                await db.Patient.destroy({
                    where: { userId: IdDel },
                    transaction: trans
                });
            } else if (RoleDel === 'admin') {
                await db.Admin.destroy({
                    where: { userId: IdDel },
                    transaction: trans
                });
            }

            await db.User.destroy({
                where: { id: IdDel },
                transaction: trans
            });

            await trans.commit();

            return resolve({
                errCode: 0,
                message: 'Delete user successful'
            });
        } catch (e) {
            trans.rollback();
            return reject(e);
        }
    });
};

const getPatientsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const patients = await db.Patient.findAll({
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'email', 'phone']
                    }
                ]
            });

            return resolve({
                errCode: 0,
                message: 'Get patients successful',
                data: patients
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const createSpecialtyService = (name, description, imageFilename, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingSpecialty = await db.Specialty.findOne({
                where: { name: name }
            });

            if (existingSpecialty) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Specialty already exists'
                });
            }

            const imagePath = path
                .join('/uploads', 'specialties', imageFilename)
                .replace(/\\/g, '/');

            await db.Specialty.create({
                name: name,
                description: description,
                image: imagePath,
                status: status
            });

            return resolve({
                errCode: 0,
                message: 'Create specialty successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const updateSpecialtyService = (specialtyId, data, imageFile) => {
    return new Promise(async (resolve, reject) => {
        try {
            const specialty = await db.Specialty.findOne({
                where: { id: specialtyId }
            });

            if (!specialty) {
                if (imageFile) {
                    fs.unlinkSync(imageFile.path);
                }
                return resolve({
                    errCode: 2,
                    errMessage: 'Specialty not found'
                });
            }

            const oldImagePath = specialty.image;

            const specialtyData = {};
            if (data.name !== undefined) specialtyData.name = data.name;
            if (data.description !== undefined)
                specialtyData.description = data.description;
            if (data.status !== undefined) specialtyData.status = data.status;

            if (imageFile)
                specialtyData.image = path
                    .join('/uploads', 'specialties', imageFile.filename)
                    .replace(/\\/g, '/');

            await db.Specialty.update(specialtyData, {
                where: { id: specialtyId }
            });

            console.log('image path: ', oldImagePath);

            if (imageFile && oldImagePath) {
                const fullOldImagePath = path.join(
                    __dirname,
                    '..',
                    oldImagePath
                );
                if (fs.existsSync(fullOldImagePath)) {
                    fs.unlinkSync(fullOldImagePath);
                }
            }

            return resolve({
                errCode: 0,
                message: 'Update specialty successful'
            });
        } catch (e) {
            if (imageFile) {
                fs.unlink(imageFile.path, (err) => {
                    if (err)
                        console.error(
                            'Failed to cleanup uploaded file on error:',
                            err
                        );
                });
            }
            return reject(e);
        }
    });
};

const deleteSpecialtyService = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        const specialty = await db.Specialty.findOne({
            where: { id: specialtyId }
        });

        if (!specialty) {
            return resolve({
                errCode: 2,
                errMessage: 'Specialty not found'
            });
        }

        const oldImagePath = specialty.image;

        await db.Specialty.destroy({
            where: { id: specialtyId }
        });

        const fullOldImagePath = path.join(__dirname, '..', oldImagePath);
        if (fs.existsSync(fullOldImagePath)) {
            fs.unlinkSync(fullOldImagePath);
        }

        return resolve({
            errCode: 0,
            message: 'Delete specialty successful'
        });
    });
};

const createServiceService = (
    name,
    description,
    durationMinutes,
    price,
    status
) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (durationMinutes <= 0) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Duration must be greater than 0'
                });
                s;
            }

            if (price <= 0) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Price must be greater than 0'
                });
            }

            await db.Service.create({
                name: name,
                description: description,
                durationMinutes: durationMinutes,
                price: price,
                status: status
            });

            return resolve({
                errCode: 0,
                message: 'Create service successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const updateServiceService = (serviceId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const service = await db.Service.findOne({
                where: { id: serviceId }
            });

            if (!service) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Service not found'
                });
            }

            if (data.durationMinutes && data.durationMinutes <= 0) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Duration must be greater than 0'
                });
            }

            if (data.price && data.price <= 0) {
                return resolve({
                    errCode: 4,
                    errMessage: 'Price must be greater than 0'
                });
            }

            const serviceData = {};
            if (data.name !== undefined) serviceData.name = data.name;
            if (data.description !== undefined)
                serviceData.description = data.description;
            if (data.durationMinutes !== undefined)
                serviceData.durationMinutes = data.durationMinutes;
            if (data.price !== undefined) serviceData.price = data.price;
            if (data.status !== undefined) serviceData.status = data.status;

            await db.Service.update(serviceData, {
                where: { id: serviceId }
            });

            return resolve({
                errCode: 0,
                message: 'Update service successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const deleteServiceService = (serviceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const service = await db.Service.findOne({
                where: { id: serviceId }
            });

            if (!service) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Service not found'
                });
            }

            await db.Service.destroy({
                where: { id: serviceId }
            });

            return resolve({
                errCode: 0,
                message: 'Delete service successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const createScheduleAndSlotService = (
    doctorId,
    name,
    workDate,
    shift,
    status
) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();
        const SLOT_DURATION_MINUTES = 30;

        try {
            const shiftList = Array.isArray(shift) ? shift : [shift];

            const dateObj = new Date(workDate);
            dateObj.setHours(0, 0, 0, 0);
            const normalizedWorkDate = dateObj;

            for (const currentShift of shiftList) {
                const shiftTime = getShiftTime(currentShift);

                if (!shiftTime) {
                    await trans.rollback();
                    return resolve({
                        errCode: 2,
                        errMessage: `Invalid shift ${currentShift}`
                    });
                }

                const existingSchedule = await db.Schedule.findOne({
                    where: {
                        doctorId: doctorId,
                        workDate: normalizedWorkDate,
                        shift: currentShift
                    },
                    transaction: trans
                });

                if (existingSchedule) {
                    await trans.rollback();
                    return resolve({
                        errCode: 3,
                        errMessage: `Schedule for shift ${currentShift} on ${
                            normalizedWorkDate.toISOString().split('T')[0]
                        } already exists`
                    });
                }

                const newSchedule = await db.Schedule.create(
                    {
                        doctorId: doctorId,
                        name: name,
                        workDate: normalizedWorkDate,
                        shift: currentShift,
                        status: status
                    },
                    { transaction: trans }
                );

                const slots = [];

                const startTime = new Date(normalizedWorkDate);
                startTime.setHours(shiftTime.startHour, 0, 0, 0);

                const endTime = new Date(normalizedWorkDate);
                endTime.setHours(shiftTime.endHour, 0, 0, 0);

                let currentTime = new Date(startTime);

                while (currentTime < endTime) {
                    const nextTime = new Date(
                        currentTime.getTime() + SLOT_DURATION_MINUTES * 60000
                    );

                    slots.push({
                        doctorId: doctorId,
                        scheduleId: newSchedule.id,
                        startTime: currentTime,
                        endTime: nextTime,
                        capacity: 1,
                        status: 'available'
                    });

                    currentTime = nextTime;
                }

                await db.Slot.bulkCreate(slots, { transaction: trans });
            }

            await trans.commit();

            return resolve({
                errCode: 0,
                message: 'Create schedule and slot successful'
            });
        } catch (e) {
            await trans.rollback();
            return reject(e);
        }
    });
};

module.exports = {
    getUsersService,
    getUserByIdService,
    createHopistalAdminService,
    createUserService,
    updateUserService,
    deleteUserService,
    getPatientsService,
    createSpecialtyService,
    updateSpecialtyService,
    deleteSpecialtyService,
    createServiceService,
    updateServiceService,
    deleteServiceService,
    createScheduleAndSlotService
};
