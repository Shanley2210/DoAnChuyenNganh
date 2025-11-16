// const paymentService = require('../services/payment.service');

// const createDepositPaymentController = async (req, res) => {
//     try {
//         const { appointmentId, paymentMethod } = req.body;

//         if (!appointmentId || !paymentMethod) {
//             return res.status(200).json({
//                 errCode: 1,
//                 errMessage: 'Missing required parameters'
//             });
//         }

//         const response = await paymentService.createDepositPaymentService(
//             appointmentId,
//             paymentMethod,
//             req.ip
//         );

//         return res.status(200).json(response);
//     } catch (e) {
//         console.log('Error in createDepositPayment:', e);
//         return res.status(500).json({
//             errCode: -1,
//             errMessage: 'Error from server'
//         });
//     }
// };

// module.exports = { createDepositPaymentController };
