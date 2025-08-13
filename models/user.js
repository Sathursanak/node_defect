const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const { Sequelize } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: DataTypes.STRING(255),
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

    first_name: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },

    join_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    password: {
      type: DataTypes.STRING(225),
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },

    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    user_gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },

    user_id: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },

    user_status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = User;
