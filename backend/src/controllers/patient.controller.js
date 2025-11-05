const patientService = require('../services/patient.service');

const getDetailPatientController = async (req, res) => {
    try {
        const userId = req.params.id;

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

const createPatientController = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const data = req.body;

        if (!data.dob || !data.gender || !data.address) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        if (role !== 'patient') {
            return res.status(200).json({
                errCode: 2,
                errMessage: 'You are not a patient'
            });
        }

        const response = await patientService.createPatientService(
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

const updatePatientController = async (req, res) => {
    const updateId = req.params.id;
    const data = req.body;
    const role = req.user.role;

    if (!data || !updateId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        });
    }

    if (role !== 'patient') {
        return res.status(200).json({
            errCode: 2,
            errMessage: 'You are not a patient'
        });
    }

    const response = await patientService.updatePatientService(updateId, data);

    return res.status(200).json(response);
};

const deletePatientController = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await patientService.deletePatientService(userId);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in deletePatient:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = {
    getDetailPatientController,
    createPatientController,
    updatePatientController,
    deletePatientController
};
