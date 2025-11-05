'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Doctor.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            Doctor.belongsTo(models.Specialty, {
                foreignKey: 'specialtyId',
                as: 'specialty'
            });

            Doctor.hasMany(models.Schedule, {
                foreignKey: 'doctorId',
                as: 'schedules'
            });

            Doctor.hasMany(models.Slot, {
                foreignKey: 'doctorId',
                as: 'slots'
            });

            Doctor.hasMany(models.Appointment, {
                foreignKey: 'doctorId',
                as: 'appointments'
            });

            Doctor.hasMany(models.Record, {
                foreignKey: 'doctorId',
                as: 'records'
            });
        }
    }
    Doctor.init(
        {
            userId: DataTypes.INTEGER,
            specialtyId: DataTypes.INTEGER,
            dob: DataTypes.DATE,
            gender: DataTypes.STRING,
            ethnicity: DataTypes.STRING,
            address: DataTypes.STRING,
            degree: DataTypes.STRING,
            room: DataTypes.STRING,
            image: DataTypes.STRING,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Doctor'
        }
    );
    return Doctor;
};
