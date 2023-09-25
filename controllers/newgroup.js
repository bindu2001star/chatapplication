const GroupChat = require("../model/Groupchat");
const User = require("../model/users");
const AddingUsersToGroup = require("../model/addinguserstogroup");

async function PostNewGroup(req, res, next) {
  console.log("adding groupName in controller");
  const { groupName } = req.body;
  console.log("groupname", groupName);
  try {
    const checkinggroupname = await GroupChat.findOne({
      where: { name: groupName },
    });
    if (checkinggroupname) {
      res.status(401).json({ message: "user already exist" }); 
    } else {
      const groupchat = await GroupChat.create({
        name: groupName,
      });
      const groupId = groupchat.id;
      console.log(groupId, "why printing id here");
      await AddingUsersToGroup.create({
        GroupName: groupName,
        NameOfUser: req.user.name,
        UserId: req.user.id,
        GroupId: groupchat.id,
        isAdmin: true,
      });
      return res.status(201).json({
        group: groupchat,
      });
    }
  } catch (err) {
    console.log("Error creating group:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
}

const getgroupList = async (req, res, next) => {
  console.log("getgroups in controller");
  try {
    // const users = await User.findAll({
    //   attributes: ["id", "name", "email", "phoneNumber"],
    // });
    const groups=await AddingUsersToGroup.findAll({where:{UserId:req.user.id}});
    return res.json({
      groups:groups
    });
  } catch (error) {
    console.log('Error getting group list:', error);
    res.status(500).json({ error: 'Failed to get group list' });
  }
};
const Addusers = async (req, res, next) => {
  const groupId = req.query.groupId;
  const userId = req.query.userId;
  const { groupName, dataNameValue } = req.body;
  console.log(groupName, "add user to body");

  try {
    //const group = await GroupChat.findByPk(groupId);
    //await group.addUser(userId);

    const Addinguserstogroup = await AddingUsersToGroup.create({
      GroupName: groupName,
      NameOfUser: dataNameValue,
      UserId: userId,
      GroupId: groupId,
    });
    return res.status(200).json({
      Addinguserstogroup: Addinguserstogroup,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  PostNewGroup: PostNewGroup,
 getgroupList:getgroupList,
  Addusers: Addusers,
};
