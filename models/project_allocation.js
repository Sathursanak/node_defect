const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Project_allocation =  sequelize.define(
  "Project_allocation",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_percentage:{
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
    }

    //project_id, role_id, user_id

  },{
    tableName: "project_allocation",
    timestamps: false,
  }
);

module.exports = Project_allocation;