const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Project_allocation_history = sequelize.define(
  "Project_allocation_history",
  {
     id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    percentage:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    end_date:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    start_date:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    status:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }

    //project_id, role_id, user_id
  },{
    tableName:"project_allocation_history",
    timestamps: false,
  }
);

module.exports = Project_allocation_history;