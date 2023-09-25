const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const AddUsers = sequelize.define("UserInGroup", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  GroupName:{
    type:Sequelize.STRING,
    allowNull:false
  },
  NameOfUser:{
    type:Sequelize.STRING,
    allowNull:false

  },
  UserId:{
    type: Sequelize.INTEGER,
    allowNull: false,

  },
  GroupId:{
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
});
module.exports=AddUsers;
