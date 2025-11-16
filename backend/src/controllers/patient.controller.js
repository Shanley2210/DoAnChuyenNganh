const patientService = require('../services/patient.service');

const getDetailPatientController = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await patientService.getDetailPatientService(userId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getDetailPatient:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const createProfilePatientController = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        if (!data || !userId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await patientService.createProfilePatientService(
            userId,
            data
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in createPatient:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const updateProfilePatientController = async (req, res) => {
    const userId = req.user.id;
    const data = req.body;

    if (!data) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        });
    }

    const response = await patientService.updateProfilePatientService(
        userId,
        data
    );

    return res.status(200).json(response);
};

const getAppointmentsController = async (req, res) => {
    try {
        const patientId = req.user.id;

        const response = await patientService.getAppointmentsService(patientId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getAppointments:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const createAppointmentController = async (req, res) => {
    const userId = req.user.id;
    const { doctorId, slotId, serviceId } = req.body;

    const response = await patientService.createAppointmentService(
        userId,
        doctorId,
        slotId,
        serviceId
    );

    return res.status(200).json(response);
};

const updateAppointmentController = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointmentId = req.params.id;
        const data = req.body;

        if (!data || !appointmentId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await patientService.updateAppointmentService(
            userId,
            appointmentId,
            data
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in updateAppointment:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const deleteAppointmentController = async (req, res) => {
    try {
        const patientId = req.user.id;
        const appointmentId = req.params.id;

        if (!appointmentId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await patientService.deleteAppointmentService(
            patientId,
            appointmentId
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deleteAppointment:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = {
    getDetailPatientController,
    createProfilePatientController,
    updateProfilePatientController,
    createAppointmentController,
    getAppointmentsController,
    updateAppointmentController,
    deleteAppointmentController
};
