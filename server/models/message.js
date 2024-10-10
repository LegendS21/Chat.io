'use strict';
const {
  Model
} = require('sequelize');
const message = require('../../../../GroupProject/chat-io/server/models/message');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Room, { foreignKey: 'roomId' })
      Message.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Message.init({
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};