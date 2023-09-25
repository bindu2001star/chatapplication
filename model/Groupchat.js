const Sequelize=require("sequelize");
const sequelize=require("../util/database");

const GroupChat=sequelize.define('Groupchat',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: Sequelize.STRING,
      NoOfParticipants: Sequelize.INTEGER,

})
module.exports=GroupChat;