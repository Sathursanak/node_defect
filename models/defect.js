const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Defect = sequelize.define(
  "Defect",
  {
    id:{
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    
    attachment:{
      type: DataTypes.STRING(225),
    },
    defect_id:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    re_open_count:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    steps:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    assigned_by:{
      type: DataTypes.BIGINT,
      allowNull: false,
     
    },
    assigned_to:{
      type: DataTypes.BIGINT,
      allowNull: false,
    }
    //assigned_to, assigned_by, defect_status_id, type_id, module_id, priority_id, project_id, release_test_case_id, severity_id, sub_module_id
  },
  {
    tableName : "defect",
    timestamps: false,
  }
);


module.exports = Defect;