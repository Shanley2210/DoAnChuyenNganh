'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Report.belongsTo(models.Admin, {
                foreignKey: 'adminId',
                as: 'admin'
            });
        }
    }
    Report.init(
        {
            adminId: DataTypes.INTEGER,
            reportType: DataTypes.STRING,
            fromDate: DataTypes.DATE,
            toDate: DataTypes.DATE,
            createBy: DataTypes.STRING,
            generatedAt: DataTypes.DATE,
            dataJson: DataTypes.JSON
        },
        {
            sequelize,
            modelName: 'Report'
        }
    );
    return Report;
};
