const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Group_privilege = sequelize.define(
  "Group_privilege",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    }
   
    // privilege_id:{
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },
    // role_id:{
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // }
  },{
    tableName: "group_privilege",
    timestamps: false,
  }
);

module.exports= Group_privilege;
