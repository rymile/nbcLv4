"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    static associate(models) {
      Likes.belongsTo(models.Users, {
        targetKey: "userId",
        foreignKey: "UserId",
      });
      Likes.belongsTo(models.UserInfos, {
        targetKey: "userInfoId",
        foreignKey: "UserInfoId",
      });
      Likes.belongsTo(models.Posts, {
        targetKey: "postId",
        foreignKey: "PostId",
      });
    }
  }

  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      UserInfoId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      PostId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Likes",
    }
  );

  return Likes;
};
