'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Queue extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Queue.belongsTo(models.Receptionist, {
                foreignKey: 'receptionistId',
                as: 'receptionist'
            });

            Queue.hasMany(models.Appointment, {
                foreignKey: 'queueId',
                as: 'appointments'
            });
        }
    }
    Queue.init(
        {
            receptionistId: DataTypes.INTEGER,
            number: DataTypes.INTEGER,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Queue'
        }
    );
    return Queue;
};
