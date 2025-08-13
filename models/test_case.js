const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Test_case = sequelize.define(
  "Test_case",
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    description:{
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    steps:{
     type: DataTypes.STRING(225),
     allowNull: false,
    },
    test_case_id:{
     type:DataTypes.STRING(225),
     allowNull: false,
     unique: true,
    }

    //type_id, module_id, project_id, severity_id,sub_module_id
    
  },{
    tableName: "test_case",
    timestamps: false,
  }
);

module.exports = Test_case;