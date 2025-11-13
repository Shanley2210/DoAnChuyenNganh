'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasOne(models.Admin, {
                foreignKey: 'userId',
                as: 'admin'
            });

            User.hasOne(models.Doctor, {
                foreignKey: 'userId',
                as: 'doctor'
            });

            User.hasOne(models.Patient, {
                foreignKey: 'userId',
                as: 'patient'
            });

            User.hasOne(models.Receptionist, {
                foreignKey: 'userId',
                as: 'receptionist'
            });

            User.belongsToMany(models.Role, {
                through: 'UserRole',
                foreignKey: 'userId',
                otherKey: 'roleId',
                as: 'roles'
            });

            User.belongsToMany(models.Permission, {
                through: 'UserPermission',
                foreignKey: 'userId',
                otherKey: 'permissionId',
                as: 'permissions'
            });
        }
    }
    User.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            password: DataTypes.STRING,
            verify: DataTypes.BOOLEAN,
            otp: DataTypes.STRING,
            otpExpires: DataTypes.DATE,
            refreshToken: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'User'
        }
    );
    return User;
};
