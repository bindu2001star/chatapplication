const AddingUsersToGroup = require("../model/addinguserstogroup");
const Chat = require("../model/chat");
const User = require("../model/users");
const { Op } = require("sequelize");
const saveMessageingroup = async (req, res, next) => {
  const { message, GroupchatId } = req.body;
  console.log("groupIdd", GroupchatId);
  try {
    const newMessage = await Chat.create({
      name: req.user.name,
      message: message,
      userId: req.user.id,
      GroupchatId: GroupchatId,
    });
    //console.log("checking the message details here",newMessage, "checking the message details here")
    res.status(201).json({
      success: true,
      message: "Message saved successfully",
      details: newMessage,
    });
  } catch (error) {
    console.error("Failed to save the chat message:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save the chat message in groups",
    });
  }
};
const getMessageingroup = async (req, res, next) => {
  const groupId = req.params.groupId;
  console.log(groupId, "checking to find group id");
  try {
    const messages = await Chat.findAll({
      where: { GroupchatId: groupId },
    });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Failed to retrieve the chat messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve the chat messages in group",
    });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const Id = req.user.id;
    console.log("Iddd", Id);
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: Id, // [Op.ne] means "not equal to"
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log("Could not find user list");
    res.status(400).send({ error: "Failed to get user list" });
  }
};
const AddtoGroup = async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const userId = req.body.userId;
    const groupName = req.body.groupName;
    const userName = req.body.userName;
    //console.log(req.body, "Printing body here");
    console.log(userName, "userrrrNmaaee");
    const existingUser = await AddingUsersToGroup.findOne({
      where: { GroupId: groupId, UserId: userId },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User is already in the group" });
    }
    const group = await AddingUsersToGroup.create({
      GroupId: groupId,
      UserId: userId,
      GroupName: groupName,
      NameOfUser: userName,
    });
    console.log(group, "checking for group name in details");

    res
      .status(200)
      .json({ message: "User added to group successfully", group: group });
  } catch (error) {
    console.log("Error adding user to group:", error);
    res.status(500).json({ error: "Failed to add user to group" });
  }
};
const getMembers = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const members = await AddingUsersToGroup.findAll({
      where: { GroupId: groupId },
    });
    return res.status(200).json(members);
  } catch (error) {
    console.error("Failed to retrieve the members:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve the group Members" });
  }
};
async function removeUser(req, res) {
  try {
    const userId = req.body.userId;
    const groupId = req.params.groupId;
    console.log(userId, groupId, "printing user and group id");

    const remove = await AddingUsersToGroup.destroy({
      where: { GroupId: groupId, UserId: userId },
    });

    if (remove === 0) {
      return res.status(404).json({
        message: "The user was not found in the group.",
      });
    }

    res.json({
      message: "The user has been deleted.",
    });
  } catch (error) {
    console.log("Error while deleting user:", error);
    res.status(500).json({
      message: "An error occurred while deleting the user.",
    });
  }
}
const getAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const group = await AddingUsersToGroup.findAll({
      where: { GroupId: groupId, UserId: userId },
    });
    const admin = group.length > 0 ? group[0].isAdmin : null;
    console.log(admin, "printing the admin value");
    if (admin == true) {
      const isAdmin = 1;
      res.json(isAdmin);
    } else {
      res.send("The user is not an admin of this group.");
    }
  } catch (error) {
    console.log("Error fetching group details:", error);
    res.status(500).send("Error fetching group details.");
  }
};
const makeAdmin=async(req,res,next)=>{
  try{
    const userId = req.body.userId;
    const groupId = req.params.groupId;

    console.log(userId, groupId, 'printing user and group id');

    const admin = await AddingUsersToGroup.update(
      { isAdmin: true },
      { where: { GroupId: groupId, UserId: userId } }
    );

    res.json({
      admin,
      message: 'Congratulations! The user is now the admin.',
    });

  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });

  }
}

module.exports = {
  saveMessageingroup: saveMessageingroup,
  getMessageingroup: getMessageingroup,
  getUsers: getUsers,
  AddtoGroup: AddtoGroup,
  getMembers: getMembers,
  removeUser: removeUser,
  getAdmin: getAdmin,
  makeAdmin:makeAdmin
};
