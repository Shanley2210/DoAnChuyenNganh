'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Services', [
            {
                name: 'Khám tổng quát',
                description:
                    'Dịch vụ khám sức khỏe toàn thân giúp phát hiện sớm các vấn đề tiềm ẩn và tư vấn điều trị kịp thời.',
                durationMinutes: 30,
                price: 300000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Khám tim mạch',
                description:
                    'Khám, đo điện tim và tư vấn điều trị các bệnh lý về tim mạch như tăng huyết áp, đau ngực, rối loạn nhịp tim.',
                durationMinutes: 40,
                price: 400000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Khám tai mũi họng',
                description:
                    'Khám và điều trị các bệnh lý về tai, mũi, họng như viêm xoang, viêm amidan, ù tai, viêm họng mãn tính.',
                durationMinutes: 25,
                price: 250000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Khám nhi',
                description:
                    'Dịch vụ khám và tư vấn sức khỏe cho trẻ em, bao gồm theo dõi phát triển, tiêm chủng và điều trị bệnh thường gặp.',
                durationMinutes: 30,
                price: 350000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Khám da liễu',
                description:
                    'Khám và điều trị các bệnh lý da liễu như mụn trứng cá, viêm da, dị ứng, nấm da, và tư vấn chăm sóc da.',
                durationMinutes: 30,
                price: 320000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
