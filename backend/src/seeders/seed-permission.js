'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Permissions', [
            {
                name: 'system_management',
                description: 'Quản lý toàn bộ hệ thống (dành cho System Admin)',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'user_manage_all',
                description:
                    'Quản lý tất cả tài khoản người dùng (tạo, sửa, xóa)',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'user_view_all',
                description: 'Xem danh sách tất cả người dùng',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'doctor_manage',
                description: 'Quản lý thông tin Bác sĩ',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'patient_view_medical_history',
                description: 'Xem hồ sơ bệnh án của bệnh nhân',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'appointment_manage',
                description: 'Tạo, sửa, hủy lịch hẹn cho bệnh nhân',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'service_manage',
                description: 'Quản lý dịch vụ và chuyên khoa',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'patient_book_appointment',
                description: 'Đặt lịch hẹn',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'profile_manage',
                description: 'Quản lý hồ sơ cá nhân',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'doctor_schedule_manage',
                description: 'Quản lý lịch làm việc của bác sĩ',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'view_user_detail',
                description: 'Xem chi tiết người dùng',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'view_doctor_schedule',
                description: 'Xem lịch làm việc của bác sĩ',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'view_doctor_appointment',
                description: 'Xem lịch hẹn của bác sĩ',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'queue_manage',
                description: 'Quản lý hàng đợi',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'comfirm_appointment',
                description: 'Xác nhận lịch hẹn',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Permissions', null, {});
    }
};
