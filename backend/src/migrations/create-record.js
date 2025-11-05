'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Records', {
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
            serviceId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            appointmentId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            examDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            diagnosis: {
                type: Sequelize.STRING,
                allowNull: true
            },
            symptoms: {
                type: Sequelize.STRING,
                allowNull: true
            },
            soapNotes: {
                type: Sequelize.STRING,
                allowNull: true
            },
            prescription: {
                type: Sequelize.STRING,
                allowNull: true
            },
            reExamDate: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('Records');
    }
};
