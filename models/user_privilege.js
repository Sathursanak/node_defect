const {DataTypes} = require('sequelize');
const sequelize = require("../db");

const User_privilege = sequelize.define(
  "User_privilege",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    //privilege_id
    // user_id
    // project_id


  },{
    tableName:"user_privilege",
    timestamps: false,
  }
);

module.exports = User_privilege;