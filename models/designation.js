// imports DataTypes from the Sequelize library
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // imports the Sequelize instance in db.js

const Designation = sequelize.define('Designation', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  designation: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
}, {
  tableName: 'designation', 
  timestamps: false,   
});

module.exports = Designation;