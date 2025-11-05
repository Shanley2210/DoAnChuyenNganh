'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Receptionist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Receptionist.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            Receptionist.hasMany(models.Queue, {
                foreignKey: 'receptionistId',
                as: 'queues'
            });
        }
    }
    Receptionist.init(
        {
            userId: DataTypes.INTEGER,
            image: DataTypes.STRING,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Receptionist'
        }
    );
    return Receptionist;
};
