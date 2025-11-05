'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Receptionists', [
            {
                userId: '17',
                image: '/uploads/users/1762243057145-829053839.webp',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '18',
                image: '/uploads/users/1762243081447-360021260.webp',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '19',
                image: '/uploads/users/1762243100668-665364997.webp',
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
