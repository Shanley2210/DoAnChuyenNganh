'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserPermission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UserPermission.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            UserPermission.belongsTo(models.Permission, {
                foreignKey: 'permissionId',
                as: 'permission'
            });
        }
    }
    UserPermission.init(
        {
            userId: DataTypes.INTEGER,
            permissionId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'UserPermission'
        }
    );
    return UserPermission;
};
