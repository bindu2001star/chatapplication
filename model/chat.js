const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  

  chat: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = Chat;
