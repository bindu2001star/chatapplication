
const Chat = require("../model/chat");
const User = require("../model/users");
const GroupChat = require("../model/Groupchat");
const Admin=require("../model/Admin")
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

exports.getGroups = async (req, res, next) => {
  try {
   
    const groups = await GroupChat.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: User,
          attributes: [],
          where: { id: req.user.id },
        },
      ],
    });
    console.log("groupppss",groups);
    res.json({
      groups: groups,
    });
  } catch (error) {
    console.log(error, "error while getting groups in controller");
    res.status(500).json({
      success: false,
    });
  }
};

exports.getMembers = async (req, res, next) => {
  const gpId = req.query.gpId;
  try {
    // find all the admin members
    const groupAdminMembers = await GroupChat.findOne({
      where: { id: gpId },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
          include: [
            {
              model: Admin,
              where: { GroupchatId: gpId },
            },
          ],
        },
      ],
    });
   
    const adminUserIds = groupAdminMembers.users.map((user) => {
      return user.id;
    });
    console.log(adminUserIds);
    // find all the other members
    const groupOtherMembers = await GroupChat.findOne({
      where: { id: gpId },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
          where: {
            id: { [Op.notIn]: adminUserIds },
          },
        },
      ],
    });
    const adminmembers = groupAdminMembers.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        isAdmin: true,
      };
    });
    let othermembers;
    const otherMembersIds = [];
    if (groupOtherMembers) {
      othermembers = groupOtherMembers.users.map((user) => {
        otherMembersIds.push(user.id);
        return {
          id: user.id,
          name: user.name,
          isAdmin: false,
        };
      });
    } else {
      othermembers = [];
    }
    members = [...adminUserIds, ...otherMembersIds];
    res.json({
      members: [...adminmembers, ...othermembers],
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};



exports.getNonMembers=async(req,res,next)=>{
  const gpId = req.query.gpId;
  console.log("nonMembers", members);
  try {
    const users = await User.findAll({
      where: { id: { [Op.notIn]: members } },
      attributes: ["id", [Sequelize.col("name"), "name"]],
    });
    console.log(users);
    res.json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }

}


