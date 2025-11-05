'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Patients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: true
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ethnicity: {
                type: Sequelize.STRING,
                allowNull: true
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            insuranceTerm: {
                type: Sequelize.STRING,
                allowNull: true
            },
            insuranceNumber: {
                type: Sequelize.STRING,
                allowNull: true
            },
            familyAddress: {
                type: Sequelize.STRING,
                allowNull: true
            },
            notePMH: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Patients');
    }
};
