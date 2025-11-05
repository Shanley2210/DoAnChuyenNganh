'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Slot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Slot.belongsTo(models.Doctor, {
                foreignKey: 'doctorId',
                as: 'doctor'
            });

            Slot.belongsTo(models.Schedule, {
                foreignKey: 'scheduleId',
                as: 'schedule'
            });

            Slot.hasMany(models.Appointment, {
                foreignKey: 'slotId',
                as: 'appointments'
            });
        }
    }
    Slot.init(
        {
            doctorId: DataTypes.INTEGER,
            scheduleId: DataTypes.INTEGER,
            startTime: DataTypes.DATE,
            endTime: DataTypes.DATE,
            capacity: DataTypes.INTEGER,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Slot'
        }
    );
    return Slot;
};
