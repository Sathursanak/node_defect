const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Sub_module = sequelize.define(
  "Sub_modules",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sub_module_id:{
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },
    sub_module_name:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
  },{
    tableName: "sub_module",
    timestamps: false,
  }
);

module.exports = Sub_module;