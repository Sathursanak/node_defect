const {DataTypes} = require('sequelize');
const sequelize = require("../db");

const Severity = sequelize.define(
  "Severity",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
   
    severity_color:{
      type: DataTypes.STRING(255),
      allowNull:false,
      unique: true,
    },

    severity_name:{
      type: DataTypes.STRING(255),
      allowNull:false,
      unique: true,
    },
    weight:{
      type: DataTypes.STRING(225),
      allowNull:false,
    }
  },{
    tableName: "severity",
    timestamps: false,
  }
)

module.exports = Severity;  