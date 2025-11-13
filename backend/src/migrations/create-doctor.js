'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Doctors', {
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
            specialtyId: {
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
            degree: {
                type: Sequelize.STRING,
                allowNull: true
            },
            room: {
                type: Sequelize.STRING,
                allowNull: true
            },
            image: {
                type: Sequelize.STRING,
                allowNull: true
            },
            price: {
                type: Sequelize.DECIMAL,
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
        await queryInterface.dropTable('Doctors');
    }
};
