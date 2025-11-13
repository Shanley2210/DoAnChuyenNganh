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
                    userId: newUser.id
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

const getRolesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const roles = await db.Role.findAll();

            if (!roles) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Roles not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get roles successful',
                data: roles
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const createRoleService = (name, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingRole = await db.Role.findOne({
                where: { name: name }
            });

            if (existingRole) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Role already exists'
                });
            }

            await db.Role.create({
                name: name,
                description: description
            });

            return resolve({
                errCode: 0,
                message: 'Create role successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const deleteRoleService = (roleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const role = await db.Role.findOne({
                where: { id: roleId }
            });

            if (!role) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Role not found'
                });
            }

            await db.Role.destroy({
                where: { id: roleId }
            });

            return resolve({
                errCode: 0,
                message: 'Delete role successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const getPermissionsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const permissions = await db.Permission.findAll();

            if (!permissions) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Permissions not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get permissions successful',
                data: permissions
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const createPermissionService = (name, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingPermission = await db.Permission.findOne({
                where: { name: name }
            });

            if (existingPermission) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Permission already exists'
                });
            }

            await db.Permission.create({
                name: name,
                description: description
            });

            return resolve({
                errCode: 0,
                message: 'Create permission successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const deletePermissionService = (permissionId) => {
    return new Promise(async (resolve, reject) => {
        const permission = await db.Permission.findOne({
            where: { id: permissionId }
        });

        if (!permission) {
            return resolve({
                errCode: 2,
                errMessage: 'Permission not found'
            });
        }

        await db.Permission.destroy({
            where: { id: permissionId }
        });

        return resolve({
            errCode: 0,
            message: 'Delete permission successful'
        });
    });
};

const getUserPermissionService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                attributes: {
                    exclude: ['password', 'otp', 'otpExpires', 'refreshToken']
                },
                include: [
                    {
                        model: db.Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }
                ]
            });

            if (!users) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Users not found'
                });
            }

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

const createUserPermissionService = (userId, permissionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existing = await db.UserPermission.findOne({
                where: { userId: userId, permissionId: permissionId }
            });

            if (existing) {
                return resolve({
                    errCode: 2,
                    errMessage:
                        'The user has already been granted this permission.'
                });
            }

            await db.UserPermission.create({
                userId: userId,
                permissionId: permissionId
            });

            return resolve({
                errCode: 0,
                message: 'Permission granted successfully.'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const deleteUserPermissionService = (userId, permissionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userpermission = await db.UserPermission.findOne({
                where: { userId: userId, permissionId: permissionId }
            });

            if (!userpermission) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User permission not found'
                });
            }

            await db.UserPermission.destroy({
                where: { userId: userId, permissionId: permissionId }
            });

            return resolve({
                errCode: 0,
                message: 'Delete user permission successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
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
                        model: db.Receptionist,
                        as: 'receptionist',
                        attributes: {
                            exclude: ['id', 'userId']
                        }
                    },
                    {
                        model: db.Role,
                        as: 'roles',
                        through: { attributes: [] },
                        include: [
                            {
                                model: db.Permission,
                                as: 'permissions',
                                through: { attributes: [] }
                            }
                        ]
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

const deleteUserService = (delId) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();

        try {
            const userDel = await db.User.findOne({
                where: { id: delId },
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        through: { attributes: [] }
                    }
                ],
                transaction: trans
            });

            if (!userDel) {
                await trans.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            const roleDelete = userDel.roles;
            const RoleDel = roleDelete[0].id;

            if (RoleDel === 4) {
                const doctor = await db.Doctor.findOne({
                    where: { userId: delId },
                    transaction: trans
                });

                const oldImagePath = doctor.image;

                await db.Doctor.destroy({
                    where: { userId: delId },
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
            } else if (RoleDel === 5) {
                const receptionist = await db.Receptionist.findOne({
                    where: { userId: delId },
                    transaction: trans
                });

                const oldImagePath = receptionist.image;

                await db.Receptionist.destroy({
                    where: { userId: delId },
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
            } else if (RoleDel === 3) {
                await db.Patient.destroy({
                    where: { userId: delId },
                    transaction: trans
                });
            } else if (RoleDel === 2) {
                await db.Admin.destroy({
                    where: { userId: delId },
                    transaction: trans
                });
            }

            await db.UserRole.destroy({
                where: { userId: delId, roleId: RoleDel },
                transaction: trans
            });

            await db.User.destroy({
                where: { id: delId },
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

const createDoctorService = (data, imageFilename) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();
        const { name, email, phone, password, confirmPassword } = data;

        try {
            if (password !== confirmPassword) {
                await trans.rollback();
                return resolve({
                    errCode: 3,
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
                    errCode: 4,
                    errMessage: 'Email or phone number already in use'
                });
            }

            const imagePath = `/uploads/doctors/${imageFilename}`;

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await db.User.create(
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashPassword,
                    verify: true,
                    otp: null,
                    otpExpires: null,
                    refreshToken: null
                },
                { transaction: trans }
            );

            const defauRole = await db.Role.findOne({
                where: { name: 'Doctor' },
                transaction: trans
            });

            if (!defauRole) {
                await trans.rollback();
                return resolve({
                    errCode: 5,
                    errMessage: 'Doctor role not found'
                });
            }

            await db.UserRole.create(
                {
                    userId: newUser.id,
                    roleId: defauRole.id
                },
                { transaction: trans }
            );

            const {
                specialtyId,
                dob,
                gender,
                ethnicity,
                address,
                degree,
                room
            } = data;

            if (
                !specialtyId ||
                !room ||
                !dob ||
                !ethnicity ||
                !gender ||
                !address ||
                !degree
            ) {
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
                    dob: dob,
                    ethnicity: ethnicity,
                    gender: gender,
                    address: address,
                    degree: degree,
                    room: room,
                    image: imagePath,
                    status: 'active'
                },
                { transaction: trans }
            );

            await trans.commit();

            return resolve({
                errCode: 0,
                message: `Create doctor successful`
            });
        } catch (e) {
            await trans.rollback();
            return reject(e);
        }
    });
};

const updateDoctorService = (userId, data, imageFile) => {
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

            const doctor = await db.Doctor.findOne({
                where: { userId: userId },
                transaction: trans
            });

            const oldImagePath = doctor.image;

            const doctorData = {};
            if (data.specialtyId !== undefined)
                doctorData.specialtyId = data.specialtyId;
            if (data.dob !== undefined) doctorData.dob = data.dob;
            if (data.gender !== undefined) doctorData.gender = data.gender;
            if (data.ethnicity !== undefined)
                doctorData.ethnicity = data.ethnicity;
            if (data.address !== undefined) doctorData.address = data.address;
            if (data.degree !== undefined) doctorData.degree = data.degree;
            if (data.room !== undefined) doctorData.room = data.room;
            if (data.status !== undefined) doctorData.status = data.status;
            if (imageFile !== undefined)
                doctorData.image = `/uploads/doctors/${imageFile.filename}`;

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

const createReceptionistService = (data, imageFilename) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();
        const { name, email, phone, password, confirmPassword } = data;

        try {
            if (password !== confirmPassword) {
                await trans.rollback();
                return resolve({
                    errCode: 3,
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
                    errCode: 4,
                    errMessage: 'Email or phone number already in use'
                });
            }

            const imagePath = `/uploads/receptionists/${imageFilename}`;

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await db.User.create(
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashPassword,
                    verify: true,
                    otp: null,
                    otpExpires: null,
                    refreshToken: null
                },
                { transaction: trans }
            );

            const defauRole = await db.Role.findOne({
                where: { name: 'Receptionist' },
                transaction: trans
            });

            if (!defauRole) {
                await trans.rollback();
                return resolve({
                    errCode: 5,
                    errMessage: 'Receptionist role not found'
                });
            }

            await db.UserRole.create(
                {
                    userId: newUser.id,
                    roleId: defauRole.id
                },
                { transaction: trans }
            );

            const { dob, gender, ethnicity, address } = data;

            if (!dob || !ethnicity || !gender || !address) {
                await trans.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }

            await db.Receptionist.create(
                {
                    userId: newUser.id,
                    dob: dob,
                    ethnicity: ethnicity,
                    gender: gender,
                    address: address,
                    image: imagePath,
                    status: 'active'
                },
                { transaction: trans }
            );

            await trans.commit();

            return resolve({
                errCode: 0,
                message: `Create receptionist successful`
            });
        } catch (e) {
            await trans.rollback();
            return reject(e);
        }
    });
};

const updatereceptionistService = (userId, data, imageFile) => {
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

            const receptionist = await db.Receptionist.findOne({
                where: { userId: userId },
                transaction: trans
            });

            const oldImagePath = receptionist.image;

            const receptionistData = {};
            if (data.dob !== undefined) receptionistData.dob = data.dob;
            if (data.gender !== undefined)
                receptionistData.gender = data.gender;
            if (data.ethnicity !== undefined)
                receptionistData.ethnicity = data.ethnicity;
            if (data.address !== undefined)
                receptionistData.address = data.address;
            if (data.status !== undefined)
                receptionistData.status = data.status;
            if (imageFile !== undefined)
                receptionistData.image = `/uploads/receptionists/${imageFile.filename}`;

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

            const imagePath = `/uploads/specialties/${imageFilename}`;

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

const getSchedulesService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const schedules = await db.Schedule.findAll({
                where: { doctorId: doctorId },
                include: [
                    {
                        model: db.Slot,
                        as: 'slots'
                    }
                ]
            });

            if (!schedules) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Schedule not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get schedules successful',
                data: schedules
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
                        capacity: 3,
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

const deleteScheduleService = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();

        try {
            const schedule = await db.Schedule.findOne({
                where: { id: scheduleId },
                transaction: trans
            });

            if (!schedule) {
                await trans.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: 'Schedule not found'
                });
            }

            const delSlots = await db.Slot.destroy({
                where: { scheduleId: scheduleId },
                transaction: trans
            });

            await db.Schedule.destroy({
                where: { id: scheduleId },
                transaction: trans
            });

            await trans.commit();

            return resolve({
                errCode: 0,
                message: `Delete schedule successful. Deleted ${delSlots} slots.`
            });
        } catch (e) {
            trans.rollback();
            return reject(e);
        }
    });
};

const setPriceDoctorService = (doctorId, price) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.Doctor.findOne({
                where: { id: doctorId }
            });

            if (!doctor) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Doctor not found'
                });
            }

            if (price <= 0) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Price must be greater than 0'
                });
            }

            await db.Doctor.update(
                { price: price },
                { where: { id: doctorId } }
            );

            return resolve({
                errCode: 0,
                message: 'Set price successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = {
    createHopistalAdminService,
    getRolesService,
    createRoleService,
    deleteRoleService,
    getPermissionsService,
    createPermissionService,
    deletePermissionService,
    getUserPermissionService,
    createUserPermissionService,
    deleteUserPermissionService,
    getUsersService,
    getUserByIdService,
    deleteUserService,
    createDoctorService,
    updateDoctorService,
    createReceptionistService,
    updatereceptionistService,
    createSpecialtyService,
    updateSpecialtyService,
    deleteSpecialtyService,
    createServiceService,
    updateServiceService,
    deleteServiceService,
    createScheduleAndSlotService,
    deleteScheduleService,
    getSchedulesService,
    setPriceDoctorService
};
