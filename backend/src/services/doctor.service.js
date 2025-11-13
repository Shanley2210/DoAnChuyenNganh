const { where, Op } = require('sequelize');
const db = require('../models');

const getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await db.Doctor.findAll({
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'email', 'phone']
                    }
                ]
            });

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
                    errMessage: 'Doctor not found'
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

const getDoctorBySpecialtyService = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const specialty = await db.Specialty.findOne({
                where: { id: specialtyId }
            });

            if (!specialty) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Specialty not found'
                });
            }

            const doctors = await db.Doctor.findAll({
                where: { specialtyId: specialtyId },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'email', 'phone']
                    }
                ]
            });

            if (doctors.length === 0) {
                return resolve({
                    errCode: 3,
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

const getAppointmentsService = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.Doctor.findOne({
                where: { userId: userId }
            });

            if (!doctor) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Doctor not found'
                });
            }

            const doctorId = doctor.id;

            const appointments = await db.Appointment.findAll({
                where: { doctorId: doctorId },
                include: [
                    {
                        model: db.Patient,
                        as: 'patient',
                        attributes: [
                            'dob',
                            'gender',
                            'ethnicity',
                            'address',
                            'insuranceTerm',
                            'insuranceNumber',
                            'familyAddress',
                            'notePMH'
                        ],
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                attributes: ['name', 'email', 'phone']
                            }
                        ]
                    },
                    {
                        model: db.Slot,
                        as: 'slot',
                        attributes: ['startTime', 'endTime']
                    },
                    {
                        model: db.Service,
                        as: 'service',
                        attributes: ['durationMinutes', 'name', 'price']
                    }
                ]
            });

            if (!appointments) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Appointment not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get appointments successful',
                data: appointments
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = {
    getAllDoctorsService,
    getDoctorByIdService,
    getSchedulesService,
    getSlotsService,
    getDoctorBySpecialtyService,
    getAppointmentsService
};
