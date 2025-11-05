'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Schedule.belongsTo(models.Doctor, {
                foreignKey: 'doctorId',
                as: 'doctor'
            });

            Schedule.hasMany(models.Slot, {
                foreignKey: 'scheduleId',
                as: 'slots'
            });
        }
    }
    Schedule.init(
        {
            doctorId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            workDate: DataTypes.DATE,
            shift: DataTypes.STRING,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Schedule'
        }
    );
    return Schedule;
};
