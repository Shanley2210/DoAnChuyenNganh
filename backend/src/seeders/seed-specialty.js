'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Specialties', [
            {
                name: 'Cơ xương khớp',
                description:
                    'Chẩn đoán và điều trị các bệnh lý về cơ, xương, khớp như viêm khớp, thoái hóa khớp, loãng xương, đau lưng, thoát vị đĩa đệm.',
                image: '/uploads/specialties/1762244242622-894136200.png',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Thần kinh',
                description:
                    'Khám và điều trị các bệnh lý liên quan đến hệ thần kinh như đau đầu, rối loạn giấc ngủ, rối loạn tiền đình, tai biến mạch máu não.',
                image: '/uploads/specialties/1762244256553-654168478.png',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Tiêu hóa',
                description:
                    'Chuyên khám và điều trị các bệnh lý về đường tiêu hóa như viêm dạ dày, trào ngược, viêm đại tràng, hội chứng ruột kích thích.',
                image: '/uploads/specialties/1762244285678-813357738.png',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Tim mạch',
                description:
                    'Khám, chẩn đoán và điều trị các bệnh lý về tim mạch như tăng huyết áp, đau thắt ngực, suy tim, rối loạn nhịp tim.',
                image: '/uploads/specialties/1762244307381-896606875.png',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Tai - Mũi - Họng',
                description:
                    'Khám và điều trị các bệnh lý tai mũi họng như viêm xoang, viêm họng, ù tai, giảm thính lực, polyp mũi.',
                image: '/uploads/specialties/1762244317541-865827511.png',
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
