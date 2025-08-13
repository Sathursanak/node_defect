const {DataTypes} = require('sequelize');
const sequelize = require("../db");

const Defect_type = sequelize.define(
  "Defect_type",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    defect_type_name:{
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    }
  },{
    tableName: "defect_type",
    timeStamp: false,
  }
);

module.exports = Defect_type;
