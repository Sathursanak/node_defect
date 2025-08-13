const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Email_user = sequelize.define("Email_user", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  defect_email_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  module_allocation_email_status:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  project_allocation_email_status:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  submodule_allocation_email_status:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }

  //user_id
},
{
  tableName: "email_user",
  timestamps: false,
});

module.exports = Email_user;
