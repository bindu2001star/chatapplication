const Sequelize=require('sequelize');
const sequelize=new Sequelize('chatapplication','root','RAM@2001#123',{
    host:'localhost',
    dialect:'mysql'

})
module.exports=sequelize;