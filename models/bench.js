const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Bench = sequelize.define(
  "Bench",
  {
    id:{
      type:DataTypes.BIGINT,
      primaryKey:true,
      autoIncrement: true,
    },
    allocated:{
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    availability:{
     type:DataTypes.INTEGER,
     allowNull: false, 
    },
    bench_id:{
     type:DataTypes.STRING(225),
     allowNull: false, 
    }
    //user_id
  },{
    tableName:"bench",
    timestamps: false,
  }
);

module.exports = Bench;