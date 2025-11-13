'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Receptionists', [
            {
                userId: '17',
                image: '/uploads/users/1762243057145-829053839.webp',
                dob: '1985-06-10',
                gender: '1',
                ethnicity: 'Kinh',
                address: '123 Nguyễn Trãi, Hà Nội',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '18',
                image: '/uploads/users/1762243081447-360021260.webp',
                dob: '1990-02-25',
                gender: '0',
                ethnicity: 'Kinh',
                address: '45 Lê Lợi, TP. Hồ Chí Minh',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '19',
                image: '/uploads/users/1762243100668-665364997.webp',
                dob: '1988-11-12',
                gender: '1',
                ethnicity: 'Kinh',
                address: '78 Trần Phú, Đà Nẵng',
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
