const db = require('../models');

const getServiceService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const services = await db.Service.findAll();

            if (!services) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Service not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get service successful',
                data: services
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = { getServiceService };
