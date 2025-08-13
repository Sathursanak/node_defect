const {DataTypes} = require("sequelize");
const sequelize = require('../db');

const Defect_status = sequelize.define(
  "Defect_status",
  {
    id:{
      type:DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    color_code:{
     type: DataTypes.STRING(225),
     allowNull: false,
     unique: true,

    },
    defect_status_name: {
      type:DataTypes.STRING(225),
      allowNull: false,
      unique: true, 
    }
  },{
    tableName: "defect_status",
    timeStamps: false,
  }
);

module.exports = Defect_status;