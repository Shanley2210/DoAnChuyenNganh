const db = require('../models');

const getSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const specialties = await db.Specialty.findAll();

            if (!specialties) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Specialty not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get specialty successful',
                data: specialties
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = { getSpecialtyService };
