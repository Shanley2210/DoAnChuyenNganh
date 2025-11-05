const serviceService = require('../services/service.service');

const getServiceController = async (req, res) => {
    try {
        const response = await serviceService.getServiceService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getService:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

module.exports = { getServiceController };
