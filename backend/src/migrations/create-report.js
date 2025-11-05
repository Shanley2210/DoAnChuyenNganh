'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            adminId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            reportType: {
                type: Sequelize.STRING,
                allowNull: true
            },
            fromDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            toDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            createBy: {
                type: Sequelize.STRING,
                allowNull: true
            },
            generatedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            dataJson: {
                type: Sequelize.JSON,
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
        await queryInterface.dropTable('Reports');
    }
};
