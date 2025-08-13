const {DataType, DataTypes} = require('sequelize');
const sequelize = require('../db');

const Role = sequelize.define(
  "Role",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey:true,
      autoIncrement:true,
    },

    role_name:{
      type:DataTypes.STRING(225),
      allowNull:false,
      unique: true,
    }

  },{
    tableName: "role",
    timestamps:false,
  }
);
module.exports = Role;