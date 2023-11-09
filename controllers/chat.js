const Chat = require("../model/chat");
const User = require("../model/users");
const Admin=require("../model/Admin");
const { Op } = require("sequelize");

async function saveMessage(req, res) {
  try {
    console.log(req.body.message, "reqq bodyyy");
    const { message, groupId } = req.body;
    console.log("groupIddd", groupId);
    const userSendingMessage = await UserToGroup.findOne({
      where: {
        UserId: req.user.id,
        // GroupchatGroupId: groupId,
      },
    });
    if (userSendingMessage != null || userSendingMessage != undefined) {
      const data = await Chat.create({
        chat: message,
        UserId: req.user.id,
        groupchatId: gpId,
      });

      res.status(200).json({ message: "successfully saved" });
    } else {
      res.json({
        message:
          "You are not a part of the group in which you are trying to post message",
      });
    }
  } catch (error) {
    console.error("Failed to save the chat message:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to save the chat message" });
  }
}
async function getMessage(req, res, next) {
  const lastMsgId = req.query.lastMsgId;
  const gpId = req.query.gpId;
  try {
    const chats = await Chat.findAll({
      where: { id: { [Op.gt]: lastMsgId }, groupchatId: gpId },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const adminRecord = await Admin.findAll({
      where: {
        userId: req.user.id,
        groupchatId: gpId,
      },
    });
    const isAdmin = adminRecord.length !== 0;
    res.json({
      success: true,
      chats: chats,
      isAdmin: isAdmin,
    });
  } catch (err) {
    console.log(err, "error while getting messages in controllers");
    res.status(500).json({
      success: false,
    });
  }
}
module.exports = {
  saveMessage: saveMessage,
  getMessage: getMessage,
};
