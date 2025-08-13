const { DataTypes} = require('sequelize');
const sequelize = require('../db');

const Defect_history = sequelize.define(
  "Defect_history",
  {
    id:{
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    assigned_by:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    assigned_to:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    defect_date:{
      type: DataTypes.DATE,
      allowNull:false,
    },

    defect_ref_id:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },

    defect_status:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    defect_time:{
      type: DataTypes.TIME,
      allowNull:false,
    },
    previous_status:{
     type: DataTypes.STRING(225),
    allowNull: false,
    },
    record_status:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    release_id:{
     type: DataTypes.BIGINT,
      allowNull: false, 
    },
    // defect_id
  },{
    tableName: "Defect_history",
    timestamps: false,
  }
);

module.exports= Defect_history;