'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserPermissions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            permissionId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Permissions',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addConstraint('UserPermissions', {
            fields: ['userId', 'permissionId'],
            type: 'unique',
            name: 'unique_role_permission_constraint'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserPermissions');
    }
};
