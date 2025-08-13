const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Releases = sequelize.define(
  "Releases",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    release_id:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    release_name:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    releasedate:{
      type: DataTypes.DATE,
      allowNull:false,
    },
    status:{
      type: DataTypes.BOOLEAN,
    }
    // project_id, release_type_id
  },{
    tableName:"releases",
    timestamps: false,
  }
);

module.exports = Releases;