const doctorService = require('../services/doctor.service');

const getAllDoctorsController = async (req, res) => {
    try {
        const response = await doctorService.getAllDoctorsService();

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getDoctors:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const getDoctorByIdController = async (req, res) => {
    try {
        const doctorId = req.params.id;

        if (!doctorId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await doctorService.getDoctorByIdService(doctorId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getDoctorById:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getSchedulesController = async (req, res) => {
    try {
        const userId = req.user.id;

        const response = await doctorService.getSchedulesService(userId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getSchedules:', e);
    }
};

const getSlotsController = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const date = req.query.date;

        if (!date || !doctorId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await doctorService.getSlotsService(doctorId, date);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getSlots:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getDoctorBySpecialtyController = async (req, res) => {
    try {
        const specialtyId = req.params.id;

        if (!specialtyId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await doctorService.getDoctorBySpecialtyService(
            specialtyId
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getDoctorBySpecialty:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const getAppointmentsController = async (req, res) => {
    try {
        const userId = req.user.id;

        const response = await doctorService.getAppointmentsService(userId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getAppointments:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = {
    getAllDoctorsController,
    getDoctorByIdController,
    getSchedulesController,
    getSlotsController,
    getDoctorBySpecialtyController,
    getAppointmentsController
};
