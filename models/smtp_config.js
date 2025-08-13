const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Smtp_config = sequelize.define(
  "Smtp_config",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    from_email:{
      type:DataTypes.STRING(255),
    },
    from_name:{
      type:DataTypes.STRING(255),
    },
    name:{
      type:DataTypes.STRING(255),
    },
    password:{
      type:DataTypes.STRING(255),
    },
    smtp_host:{
      type:DataTypes.STRING(255),
    },
    smtp_port:{
      type: DataTypes.INTEGER,
    },
    username:{
      type:DataTypes.STRING(255),
    }
  },{
    tableName:"smtp_config",
    timestamps: false,
  }
);

module.exports = Smtp_config;