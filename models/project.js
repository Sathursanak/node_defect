const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const { Sequelize } = require("sequelize");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  client_name: {
    type: DataTypes.STRING(225),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(225),
    allowNull: false,
  },
  state:{
   type: DataTypes.STRING(225),
   allowNull: false, 
  },
  description: {
    type: DataTypes.STRING(225),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(225),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },

      notEmpty: {
        msg: "Email cannot be empty",
      },
    },
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    
  },
  start_date:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },

  kloc: {
    type: DataTypes.DOUBLE,
    allowNull:false,
  },
  phone_no:{
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  project_id:{
    type: DataTypes.STRING(225),
    allowNull: false,
    unique: true,
  },
  project_name:{
    type: DataTypes.STRING(225),
    allowNull:false,
    unique: true,
  },
  project_status:{
    type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'INACTIVE', 'ON_HOLD'),
    allowNull: false,

  }
},
{
 tableName: "project",
 timestamps: false,
});

module.exports = Project;
