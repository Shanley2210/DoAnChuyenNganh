'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Slots', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctorId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            scheduleId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            startTime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            endTime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            status: {
                type: Sequelize.STRING,
                allowNull: true
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Slots');
    }
};
