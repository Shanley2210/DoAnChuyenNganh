'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Service extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Service.hasMany(models.Record, {
                foreignKey: 'serviceId',
                as: 'records'
            });

            Service.hasMany(models.Appointment, {
                foreignKey: 'serviceId',
                as: 'appointments'
            });
        }
    }
    Service.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            durationMinutes: DataTypes.INTEGER,
            price: DataTypes.DECIMAL,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Service'
        }
    );
    return Service;
};
