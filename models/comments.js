const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Comments = sequelize.define(
  "comments",
  {
    id:{
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    
    attachment:{
      type:DataTypes.STRING(225),
    },
    comment:{
     type:DataTypes.STRING(225),
     allowNull: false, 
    },

    //defect_id, user_id

  },{
    tableName:"comments",
    timestamps: false,
  }
);

module.exports = Comments;