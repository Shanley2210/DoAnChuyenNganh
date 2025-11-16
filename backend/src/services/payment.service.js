// const db = require('../models');

// const createDepositPaymentService = async (
//     appointmentId,
//     paymentMethod,
//     ipAddress
// ) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const appointment = await db.Appointment.findOne({
//                 where: { id: appointmentId }
//             });

//             if (!appointment) {
//                 return resolve({
//                     errCode: 2,
//                     errMessage: 'Appointment not found'
//                 });
//             }

//             if (appointment.status !== 'pending') {
//                 return resolve({
//                     errCode: 3,
//                     errMessage: 'Appointment status is not pending'
//                 });
//             }

//             const amoutToDeposit = appointment.deposit;

//             if (amoutToDeposit <= 0 || !amoutToDeposit) {
//                 return resolve({
//                     errCode: 4,
//                     errMessage: 'Invalid deposit amount'
//                 });
//             }
//         } catch (e) {
//             return reject(e);
//         }
//     });
// };

// module.exports = { createDepositPaymentService };
