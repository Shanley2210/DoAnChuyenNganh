'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Payment.belongsTo(models.Record, {
                foreignKey: 'recordId',
                as: 'record'
            });

            Payment.belongsTo(models.Appointment, {
                foreignKey: 'appointmentId',
                as: 'appointment'
            });
        }
    }
    Payment.init(
        {
            recordId: DataTypes.INTEGER,
            appointmentId: DataTypes.INTEGER,
            amount: DataTypes.DECIMAL,
            method: DataTypes.STRING,
            type: DataTypes.STRING,
            status: DataTypes.STRING,
            txnRef: DataTypes.STRING,
            callback_data: DataTypes.JSON
        },
        {
            sequelize,
            modelName: 'Payment'
        }
    );
    return Payment;
};
