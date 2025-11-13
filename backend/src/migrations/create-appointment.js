'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Appointments', {
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
            patientId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            slotId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            queueId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            serviceId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            status: {
                type: Sequelize.STRING,
                allowNull: true
            },
            deposit: {
                type: Sequelize.DECIMAL,
                allowNull: true
            },
            deposited: {
                type: Sequelize.DECIMAL,
                allowNull: true
            },
            type: {
                type: Sequelize.STRING,
                allowNull: true
            },
            finalPrice: {
                type: Sequelize.DECIMAL,
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
        await queryInterface.dropTable('Appointments');
    }
};
