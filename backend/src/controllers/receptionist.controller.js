// const receptionistService = require('../services/receptionist.service');

// const confirmAppointmentController = async (req, res) => {
//     try {
//         const appointmentId = req.params.id;

//         if (!appointmentId) {
//             return res.status(200).json({
//                 errCode: 1,
//                 errMessage: 'Missing required parameters'
//             });
//         }

//         const response = await receptionistService.confirmAppointmentService(
//             appointmentId
//         );

//         return res.status(200).json(response);
//     } catch (e) {
//         console.log('Error in confirmAppointment:', e);
//         return res.status(500).json({
//             errCode: -1,
//             errMessage: 'Error from server'
//         });
//     }
// };

// const getAppointmentsTodayController = async (req, res) => {
//     try {
//         const response =
//             await receptionistService.getAppointmentsTodayService();

//         return res.status(200).json(response);
//     } catch (e) {
//         console.log('Error in getAppointmentsToday:', e);
//         return res.status(500).json({
//             errCode: -1,
//             errMessage: 'Error from server'
//         });
//     }
// };

// module.exports = {
//     confirmAppointmentController,
//     getAppointmentsTodayController
// };
