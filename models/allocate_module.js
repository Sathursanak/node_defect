const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Allocate_module = sequelize.define(
  "Allocate_module",
  {
    id:{
      type:DataTypes.BIGINT,
      primaryKey:true,
      autoIncrement: true,
    }
    //module_id, sub_modele_id, project_id, user_id
  },{
    tableName: "allocate_module",
    timestamps:false,
  }
  );
  module.exports = Allocate_module;