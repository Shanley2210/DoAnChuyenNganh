'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Record extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Record.belongsTo(models.Doctor, {
                foreignKey: 'doctorId',
                as: 'doctor'
            });

            Record.belongsTo(models.Patient, {
                foreignKey: 'patientId',
                as: 'patient'
            });

            Record.belongsTo(models.Service, {
                foreignKey: 'serviceId',
                as: 'service'
            });

            Record.belongsTo(models.Appointment, {
                foreignKey: 'appointmentId',
                as: 'appointment'
            });

            Record.hasOne(models.Payment, {
                foreignKey: 'recordId',
                as: 'payment'
            });
        }
    }
    Record.init(
        {
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            serviceId: DataTypes.INTEGER,
            appointmentId: DataTypes.INTEGER,
            examDate: DataTypes.DATE,
            diagnosis: DataTypes.STRING,
            symptoms: DataTypes.STRING,
            soapNotes: DataTypes.STRING,
            prescription: DataTypes.STRING,
            reExamDate: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Record'
        }
    );
    return Record;
};
