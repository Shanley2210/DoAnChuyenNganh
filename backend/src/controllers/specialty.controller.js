const specialtyService = require('../services/specialty.service');

const getSpecialtyController = async (req, res) => {
    try {
        const response = await specialtyService.getSpecialtyService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getSpecialty:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = { getSpecialtyController };
