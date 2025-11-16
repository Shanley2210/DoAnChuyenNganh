// const { where } = require('sequelize');
// const db = require('../models');
// const moment = require('moment');

// const confirmAppointmentService = (appointmentId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const appointment = await db.Appointment.findOne({
//                 where: { id: appointmentId }
//             });

//             if (!appointment) {
//                 return resolve({
//                     errCode: 1,
//                     errMessage: 'Appointment not found'
//                 });
//             }

//             if (appointment.status !== 'deposited') {
//                 return resolve({
//                     errCode: 2,
//                     errMessage: 'Appointment status is not deposited'
//                 });
//             }

//             await appointment.update({ status: 'confirmed' });

//             //Logic gửi mail xác nhận nữa
//         } catch (e) {}
//     });
// };

// const getAppointmentsTodayService = () => {};

// module.exports = { confirmAppointmentService, getAppointmentsTodayService };
