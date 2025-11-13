'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Roles', [
            {
                name: 'System_Admin',
                description: 'Quản trị viên hệ thống (có quyền cao nhất)',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hospital_Admin',
                description: 'Quản trị viên bệnh viện/phòng khám',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Patient',
                description: 'Bệnh nhân',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor',
                description: 'Bác sĩ',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {      
                name: 'Receptionist',
                description: 'Lễ tân/Tiếp tân',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Roles', null, {});
    }
};
