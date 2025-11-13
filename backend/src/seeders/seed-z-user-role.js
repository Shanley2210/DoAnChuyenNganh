'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Danh sách các User và RoleId tương ứng
        const userRoles = [
            { userId: 1, roleId: 1 },

            { userId: 2, roleId: 2 },

            { userId: 3, roleId: 3 },
            { userId: 4, roleId: 3 },
            { userId: 5, roleId: 3 },
            { userId: 6, roleId: 3 },
            { userId: 7, roleId: 3 },
            { userId: 8, roleId: 3 },
            { userId: 9, roleId: 3 },
            { userId: 10, roleId: 3 },
            { userId: 11, roleId: 3 },

            { userId: 12, roleId: 4 },
            { userId: 13, roleId: 4 },
            { userId: 14, roleId: 4 },
            { userId: 15, roleId: 4 },
            { userId: 16, roleId: 4 },

            { userId: 17, roleId: 5 },
            { userId: 18, roleId: 5 },
            { userId: 19, roleId: 5 }
        ];

        const finalUserRoles = userRoles.map((item) => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        return queryInterface.bulkInsert('UserRoles', finalUserRoles);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('UserRoles', null, {});
    }
};
