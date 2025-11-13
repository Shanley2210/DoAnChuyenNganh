'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Doctors', [
            {
                userId: 12,
                specialtyId: 0,
                dob: '1980-03-12',
                gender: '1',
                ethnicity: 'Kinh',
                address: '123 Nguyễn Trãi, Hà Nội',
                degree: 'Bác sĩ chuyên khoa II - Nội tổng quát',
                room: '101',
                image: '/uploads/users/1762242786635-752572594.webp',
                price: 500000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 13,
                specialtyId: 2,
                dob: '1985-07-24',
                gender: '0',
                ethnicity: 'Kinh',
                address: '45 Lê Lợi, TP. Hồ Chí Minh',
                degree: 'Thạc sĩ - Tim mạch học',
                room: '102',
                image: '/uploads/users/1762242843903-960164697.webp',
                price: 600000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 14,
                specialtyId: 3,
                dob: '1982-09-15',
                gender: '1',
                ethnicity: 'Kinh',
                address: '56 Nguyễn Huệ, Đà Nẵng',
                degree: 'Bác sĩ chuyên khoa I - Nhi khoa',
                room: '103',
                image: '/uploads/users/1762242861483-118028065.webp',
                price: 700000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 15,
                specialtyId: 4,
                dob: '1978-01-30',
                gender: '0',
                ethnicity: 'Kinh',
                address: '89 Phan Chu Trinh, Cần Thơ',
                degree: 'Tiến sĩ - Ngoại tổng quát',
                room: '104',
                image: '/uploads/users/1762242874653-920786739.webp',
                price: 200000,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 16,
                specialtyId: 5,
                dob: '1987-05-19',
                gender: '1',
                ethnicity: 'Kinh',
                address: '22 Trần Phú, Hải Phòng',
                degree: 'Thạc sĩ - Tai mũi họng',
                room: '105',
                image: '/uploads/users/1762242889138-898119219.webp',
                price: 300000,
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
