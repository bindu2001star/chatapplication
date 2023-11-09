const GroupChat = require("../model/Groupchat");
const User = require("../model/users");
const sequelize = require("../util/database");
const { Op } = require('sequelize');

async function PostNewGroup(req, res, next) {
  const { groupName } = req.body;
  try {
    const gpChat = await GroupChat.create({
      name: groupName,
    });
    await Promise.all([
      gpChat.addUser(req.user.id),
      gpChat.createAdmin({
        userId: req.user.id,
      }),
    ]);

    res.status(201).json({
      gp: gpChat,
    });
  } catch (error) {
    console.log(error, "error while entering groupname");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "phoneNumber"],
      where: {
        id: {
          [Op.ne]: req.user.id
        }
      }
    });
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

async function addUserToGroup(req, res, next) {
  const t = await sequelize.transaction();
  const userId = req.query.userId;
  const gpId = req.query.gpId;
  try {
    const group = await GroupChat.findByPk(gpId);
    await group.addUser(userId, { transaction: t });
    await t.commit();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
}
async function deleteUserFromGroup(req, res, next) {
  const t = await sequelize.transaction();
  const userId = req.query.userId;
  const gpId = req.query.gpId;
  try {
    const group = await GroupChat.findByPk(gpId);
    await group.removeUser(userId, { transaction: t });
    await t.commit();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
}

async function postUpdateGroup(req, res, next) {
  const { groupName } = req.body;
  const gpId = req.query.gpId;
  const t = await sequelize.transaction();
  try {
    await GroupChat.update(
      {
        name: groupName,
      },
      { where: { id: gpId } },
      { transaction: t }
    );
    await t.commit();
    res.json({
      success: true,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
}

module.exports = {
  PostNewGroup: PostNewGroup,
  getUsers: getUsers,
  addUserToGroup: addUserToGroup,
  deleteUserFromGroup: deleteUserFromGroup,
  postUpdateGroup: postUpdateGroup,
};
