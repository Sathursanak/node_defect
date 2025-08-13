const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Release_type = sequelize.define(
  "Release_type",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    release_type_name:{
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    }
  },{
    tableName: "release_type",
    timestamps: false,
  }
);

module.exports = Release_type;