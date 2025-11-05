const { where, Op } = require('sequelize');
const db = require('../models');

const getDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await db.Doctor.findAll({});

            if (!doctors) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Doctor not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get doctors successful',
                data: doctors
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const getDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.Doctor.findOne({
                where: { id: doctorId },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'email', 'phone']
                    },
                    {
                        model: db.Specialty,
                        as: 'specialty',
                        attributes: ['name']
                    }
                ]
            });

            if (!doctor) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Doctor not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get doctor successful',
                data: doctor
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const getSchedulesService = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.Doctor.findOne({
                where: { userId: userId }
            });

            if (!doctor) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Test nkha'
                });
            }

            const doctorId = doctor.id;

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
                    errCode: 3,
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

const getSlotsService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const slots = await db.Slot.findAll({
                where: {
                    doctorId: doctorId,
                    startTime: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                },
                order: [['startTime', 'ASC']]
            });

            if (!slots) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Slot not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get slots successful',
                data: slots
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = {
    getDoctorsService,
    getDoctorByIdService,
    getSchedulesService,
    getSlotsService
};
