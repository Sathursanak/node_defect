const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Project_user_privilege = sequelize.define(
  "Project_user_privilege",
  {
    id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  }

  //provilage_id, project_id, user_id
  },{
   tableName: "project_user_privilege",
   timeStame: false, 
  }
);

module.exports = Project_user_privilege;