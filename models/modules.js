const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Modules = sequelize.define(
  "Modules",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    module_id:{
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },
    module_name:{
      type: DataTypes.STRING(225),
      allowNull: false,
    }

  },{
    tableName:"modules",
    timeStamp: false,
  }
);

module.exports = Modules;