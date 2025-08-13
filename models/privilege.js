const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Privilege = sequelize.define(
  "Privilege",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    privilege_name:{
      type: DataTypes.STRING(255),
      allowNull:false,
      unique: true,

    },
  },{
    tableName: "privilege",
    timestamps: false,
  }
);

module.exports= Privilege;