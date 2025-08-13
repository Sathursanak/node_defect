const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Priority = sequelize.define(
  "Priority",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    color: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },

    priority: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "priority",
    timestamps: false,
  }
);

module.exports = Priority;
