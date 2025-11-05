const { verify } = require('jsonwebtoken');
const db = require('../models');

const getDetailPatientService = async (userId) => {
    return new Promise(async (resolve, reject) => {
        const user = await db.Patient.findOne({
            where: { userId: userId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
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
    });
};

const createPatientService = async (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingPatient = await db.Patient.findOne({
                where: { userId: userId }
            });

            if (existingPatient) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Patient already exists'
                });
            }

            const patientData = {
                userId: userId,
                dob: data.dob,
                gender: data.gender,
                ethnicity: data.ethnicity,
                address: data.address,
                insuranceTerm: data.insuranceTerm,
                insuranceNumber: data.insuranceNumber,
                familyAddress: data.familyAddress,
                notePMH: data.notePMH
            };

            const newPatient = await db.Patient.create(patientData);

            return resolve({
                errCode: 0,
                message: 'Create patient successful',
                data: newPatient
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const updatePatientService = async (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const patient = await db.Patient.findOne({
                where: { userId: userId }
            });

            if (!patient) {
                return resolve({
                    errCode: 3,
                    errMessage: 'User not found'
                });
            }

            const patientData = {};
            if (data.dob !== undefined) patientData.dob = data.dob;
            if (data.gender !== undefined) patientData.gender = data.gender;
            if (data.ethnicity !== undefined)
                patientData.ethnicity = data.ethnicity;
            if (data.address !== undefined) patientData.address = data.address;
            if (data.insuranceTerm !== undefined)
                patientData.insuranceTerm = data.insuranceTerm;
            if (data.insuranceNumber !== undefined)
                patientData.insuranceNumber = data.insuranceNumber;
            if (data.familyAddress !== undefined)
                patientData.familyAddress = data.familyAddress;
            if (data.notePMH !== undefined) patientData.notePMH = data.notePMH;

            await db.Patient.update(patientData, {
                where: { userId: userId }
            });

            return resolve({
                errCode: 0,
                message: 'Update patient successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const deletePatientService = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.Patient.findOne({
                where: { userId: userId }
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            await db.Patient.destroy({
                where: { userId: userId }
            });

            return resolve({
                errCode: 0,
                message: 'Delete patient successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = {
    getDetailPatientService,
    createPatientService,
    updatePatientService,
    deletePatientService
};
