const { verify } = require('jsonwebtoken');
const db = require('../models');
const { sendMail } = require('../utils/sendMail');
const moment = require('moment');
require('moment/locale/vi');

const sendAppontment = async (
    email,
    id,
    name,
    type,
    target,
    time,
    finalPrice,
    deposit,
    status
) => {
    const subject = 'Đã đặt lịch hẹn';
    const text = `Kính gửi ${
        name || 'Quý khách hàng'
    },\n. Chúng tôi xác nhận bạn đẫ đặt lịch hẹn thành công.`;

    const html = `
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #d0d0d0;padding:25px 30px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#333;line-height:1.6;">
            <h3 style="color:#0078d7;margin-bottom:15px;">Kính gửi ${
                name || 'Quý khách hàng'
            },</h3>
            <p style="margin-bottom:10px;">Chúng tôi xin xác nhận bạn đã đặt lịch hẹn thành công với các chi tiết sau:</p>

            <ul style="background:#f5f5f5;padding:15px 20px;list-style-type:none;border:1px solid #ccc;margin:15px 0;">
                <li style="margin-bottom:8px;"><strong>Mã lịch hẹn:</strong> <span style="color:#0078d7;font-weight:bold;">${id}</span></li>
                <li style="margin-bottom:8px;"><strong>Loại lịch hẹn:</strong> ${type}</li>
                <li style="margin-bottom:8px;"><strong>Đối tượng/Dịch vụ:</strong> ${target}</li>
                <li style="margin-bottom:8px;"><strong>Thời gian đặt lịch:</strong> ${time}</li>
                
                <li style="margin-bottom:8px;"><strong>Tổng chi phí dự kiến:</strong> ${finalPrice.toLocaleString(
                    'vi-VN'
                )} VNĐ</li>
                <li style="margin-bottom:8px;"><strong>Tiền cọc cần thanh toán (20%):</strong> 
                <span style="color:#0078d7;font-weight:bold;">${deposit.toLocaleString(
                    'vi-VN'
                )} VNĐ</span>
                </li>
                <li style="margin-bottom:8px;"><strong>Trạng thái:</strong> <span style="color:#e67e22;font-weight:600;">${status}</span></li>
            </ul>

            <p style="margin-bottom:10px;">Vui lòng thanh toán tiền cọc để xác nhận lịch hẹn chính thức.</p>
            <p style="margin-bottom:5px;">Trân trọng,</p>
            <p style="font-style:italic;margin:0;">Hệ thống Đặt lịch</p>
        </div>
    `;

    await sendMail(email, subject, text, html);
};

const getDetailPatientService = async (userId) => {
    return new Promise(async (resolve, reject) => {
        const user = await db.Patient.findOne({
            where: { userId: userId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        if (!user) {
            return resolve({
                errCode: 2,
                errMessage: 'User not found'
            });
        }

        return resolve({
            errCode: 0,
            message: 'Get user successful',
            data: user
        });
    });
};

const createProfilePatientService = async (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingPatient = await db.Patient.findOne({
                where: { userId: userId }
            });

            if (existingPatient) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Patient already exists'
                });
            }

            const patientData = {
                userId: userId,
                dob: data.dob,
                gender: data.gender,
                ethnicity: data.ethnicity,
                address: data.address,
                insuranceTerm: data.insuranceTerm,
                insuranceNumber: data.insuranceNumber,
                familyAddress: data.familyAddress,
                notePMH: data.notePMH
            };

            const newPatient = await db.Patient.create(patientData);

            return resolve({
                errCode: 0,
                message: 'Create profile patient successful',
                data: newPatient
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const updateProfilePatientService = async (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const patient = await db.Patient.findOne({
                where: { userId: userId }
            });

            if (!patient) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            const patientData = {};
            if (data.dob !== undefined) patientData.dob = data.dob;
            if (data.gender !== undefined) patientData.gender = data.gender;
            if (data.ethnicity !== undefined)
                patientData.ethnicity = data.ethnicity;
            if (data.address !== undefined) patientData.address = data.address;
            if (data.insuranceTerm !== undefined)
                patientData.insuranceTerm = data.insuranceTerm;
            if (data.insuranceNumber !== undefined)
                patientData.insuranceNumber = data.insuranceNumber;
            if (data.familyAddress !== undefined)
                patientData.familyAddress = data.familyAddress;
            if (data.notePMH !== undefined) patientData.notePMH = data.notePMH;

            await db.Patient.update(patientData, {
                where: { userId: userId }
            });

            return resolve({
                errCode: 0,
                message: 'Update patient successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const getAppointmentsService = async (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const appointments = await db.Appointment.findAll({
                where: { patientId: patientId },
                include: [
                    {
                        model: db.Doctor,
                        as: 'doctor',
                        attributes: ['id', 'room', 'price'],
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                attributes: ['name']
                            }
                        ]
                    },
                    {
                        model: db.Slot,
                        as: 'slot',
                        attributes: ['startTime', 'endTime']
                    },
                    {
                        model: db.Service,
                        as: 'service',
                        attributes: ['durationMinutes', 'name', 'price']
                    }
                ]
            });

            if (!appointments) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Appointment not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get appointments successful',
                data: appointments
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const createAppointmentService = async (
    patientId,
    doctorId,
    slotId,
    serviceId
) => {
    const trans = await db.sequelize.transaction();

    try {
        const isDoctorAppointment = doctorId && slotId;
        const isServiceAppointment = serviceId && !isDoctorAppointment;

        if (!isDoctorAppointment && !isServiceAppointment) {
            await trans.rollback();
            return { errCode: 1, errMessage: 'Invalid appointment type' };
        }

        let finalPrice = 0;
        let deposit = 0;
        let type = '';
        let target = '';
        let currentSlot = null;

        if (isDoctorAppointment) {
            const doctorInfo = await db.Doctor.findOne({
                where: { id: doctorId },
                include: [{ model: db.User, as: 'user', attributes: ['name'] }]
            });

            if (!doctorInfo) {
                await trans.rollback();
                return { errCode: 2, errMessage: 'Doctor not found' };
            }

            finalPrice = doctorInfo.price;

            currentSlot = await db.Slot.findOne({
                where: { id: slotId, doctorId: doctorId },
                lock: trans.LOCK.UPDATE,
                transaction: trans
            });

            if (!currentSlot || currentSlot.capacity <= 0) {
                await trans.rollback();
                return {
                    errCode: 3,
                    errMessage: 'Slot not found or slot full'
                };
            }

            currentSlot.capacity -= 1;
            if (currentSlot.capacity <= 0) {
                currentSlot.status = 'full';
            } else {
                currentSlot.status = 'booked';
            }
            await currentSlot.save({ transaction: trans });

            serviceId = null;
            type = 'doctor';
            target = `Bác sĩ ` + doctorInfo.user.name;
        } else if (isServiceAppointment) {
            const serviceInfo = await db.Service.findOne({
                where: { id: serviceId }
            });

            if (!serviceInfo) {
                await trans.rollback();
                return { errCode: 4, errMessage: 'Service not found' };
            }

            finalPrice = serviceInfo.price;
            doctorId = null;
            slotId = null;
            type = 'service';
            target = `Dịch vụ ` + serviceInfo.name;
        }

        deposit = finalPrice * 0.2;

        const patientInfo = await db.Patient.findOne({
            where: { userId: patientId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        if (!patientInfo) {
            await trans.rollback();
            return {
                errCode: 5,
                errMessage: 'Patient not found or profile not created.'
            };
        }

        const appointment = await db.Appointment.create(
            {
                doctorId: doctorId,
                patientId: patientId,
                slotId: slotId,
                serviceId: serviceId,
                status: 'pending',
                deposit: deposit,
                deposited: 0,
                type: type,
                finalPrice: finalPrice
            },
            { transaction: trans }
        );

        await trans.commit();

        const appointmentCreatedTime = moment(appointment.createdAt)
            .locale('vi')
            .format('llll');
        await sendAppontment(
            patientInfo.user.email,
            appointment.id,
            patientInfo.user.name,
            type,
            target,
            appointmentCreatedTime,
            finalPrice,
            deposit,
            'pending'
        );

        return {
            errCode: 0,
            message: 'Create appointment successful',
            data: appointment
        };
    } catch (e) {
        if (trans) await trans.rollback();
        console.error('Error in createAppointmentService:', e);
        return reject(e);
    }
};

const updateAppointmentService = async (patientId, appointmentId, data) => {
    return new Promise(async (resolve, reject) => {
        const trans = await db.sequelize.transaction();

        try {
            const oldAppointment = await db.Appointment.findOne({
                where: { id: appointmentId },
                lock: trans.LOCK.UPDATE,
                transaction: trans
            });

            if (!oldAppointment) {
                await trans.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: 'Appointment not found'
                });
            }

            if (oldAppointment.patientId !== patientId) {
                await trans.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: 'You are not the owner of this appointment'
                });
            }

            if (oldAppointment.status !== 'pending') {
                await trans.rollback();
                return resolve({
                    errCode: 4,
                    errMessage: 'You can not update this appointment'
                });
            }

            const isNewDoctorAppointment = data.doctorId && data.slotId;
            const isNewServiceAppointment =
                data.serviceId && !isNewDoctorAppointment;

            if (
                (!isNewDoctorAppointment && !isNewServiceAppointment) ||
                (data.doctorId && data.slotId && data.serviceId)
            ) {
                await trans.rollback();
                return resolve({
                    errCode: 5,
                    errMessage: 'Invalid appointment type'
                });
            }

            let newFinalPrice = 0;
            let newDeposit = 0;
            let newType = '';

            if (isNewDoctorAppointment) {
                const doctorInfo = await db.Doctor.findOne({
                    where: { id: data.doctorId }
                });

                if (!doctorInfo) {
                    return resolve({
                        errCode: 6,
                        errMessage: 'Doctor not found'
                    });
                }

                newFinalPrice = doctorInfo.price;

                const isSlotChanged = oldAppointment.slotId !== data.slotId;

                if (oldAppointment.slotId && isSlotChanged) {
                    const oldSlot = await db.Slot.findOne({
                        where: { id: oldAppointment.slotId },
                        lock: trans.LOCK.UPDATE,
                        transaction: trans
                    });

                    if (oldSlot) {
                        oldSlot.capacity += 1;
                        if (oldSlot.capacity >= 3) {
                            oldSlot.status = 'available';
                        } else {
                            oldSlot.status = 'booked';
                        }
                        await oldSlot.save({ transaction: trans });
                    }
                }

                const slotCheck = await db.Slot.findOne({
                    where: { id: data.slotId },
                    lock: trans.LOCK.UPDATE,
                    transaction: trans
                });

                if (!slotCheck || slotCheck.capacity <= 0) {
                    await trans.rollback();
                    return resolve({
                        errCode: 7,
                        errMessage: 'Slot not found or slot full'
                    });
                }

                slotCheck.capacity -= 1;
                if (slotCheck.capacity <= 0) {
                    slotCheck.status = 'full';
                } else {
                    slotCheck.status = 'booked';
                }

                await slotCheck.save({ transaction: trans });

                newType = 'doctor';
                data.serviceId = null;
            } else if (isNewServiceAppointment) {
                const serviceInfo = await db.Service.findOne({
                    where: { id: data.serviceId }
                });

                if (!serviceInfo) {
                    return resolve({
                        errCode: 8,
                        errMessage: 'Service not found'
                    });
                }

                newFinalPrice = serviceInfo.price;

                if (oldAppointment.slotId) {
                    const oldSlot = await db.Slot.findOne({
                        where: { id: oldAppointment.slotId },
                        lock: trans.LOCK.UPDATE,
                        transaction: trans
                    });

                    if (oldSlot) {
                        oldSlot.capacity += 1;
                        if (oldSlot.capacity >= 3) {
                            oldSlot.status = 'available';
                        } else {
                            oldSlot.status = 'booked';
                        }
                        await oldSlot.save({ transaction: trans });
                    }
                }

                data.doctorId = null;
                data.slotId = null;
                newType = 'service';
            }

            newDeposit = newFinalPrice * 0.2;

            await db.Appointment.update(
                {
                    doctorId: data.doctorId,
                    slotId: data.slotId,
                    serviceId: data.serviceId,
                    status: 'pending',
                    deposit: newDeposit,
                    deposited: oldAppointment.deposited || 0,
                    type: newType,
                    finalPrice: newFinalPrice
                },
                {
                    where: { id: appointmentId },
                    transaction: trans
                }
            );

            await trans.commit();

            return resolve({
                errCode: 0,
                message: 'Update appointment successful'
            });
        } catch (e) {
            await trans.rollback();
            return reject(e);
        }
    });
};

module.exports = {
    getDetailPatientService,
    createProfilePatientService,
    updateProfilePatientService,
    createAppointmentService,
    getAppointmentsService,
    updateAppointmentService
};
