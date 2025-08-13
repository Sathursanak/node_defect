const {DataTypes}= require('sequelize');
const sequelize = require('../db');

const Release_test_case = sequelize.define(
  "release_test_case",
  {
    id:{
      type: DataTypes.BIGINT,
      autoIncrement:true,
      primaryKey: true,
    },
    description:{
      type:DataTypes.STRING(225),
    },
    release_test_case_id:{
      type:DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },
    test_case_status:{
      type: DataTypes.ENUM('FAIL', 'NEW', 'PASS'),
      allowNull: false, 
      defaultValue: 'New',
    },
    test_date: {
      type: DataTypes.DATE,
    
    },
    test_time:{
      type: DataTypes.TIME,
    },
    //owner_id, release_id, test_case_id
  },{
    tableName: "release_test_case",
    timestamps: false,
  }
);

module.exports = Release_test_case;