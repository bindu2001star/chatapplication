const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlfile: {
    type: Sequelize.STRING
  }
});
module.exports=Chat;