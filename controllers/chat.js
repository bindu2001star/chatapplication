const Chat = require("../model/chat");
const User = require("../model/users");
// const UserToGroup = require('../model/usertogroup');

async function saveMessage(req, res) {
  const { message } = req.body;
  // const {message, groupId} = req.body

  try {
    const id = req.user.id;
    const name = await User.findOne({ where: { id } });
    console.log(name.name, "nameeeee");
    const Name = name.name;
    const newMessage = await req.user.createChat({
      message: message,
      name:Name
    });
    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      details: { newMessage, Name },
      name: Name,
    });
  } catch (error) {
    console.error("Failed to save the chat message:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to save the chat message" });
  }
}
async function getMessage(req, res, next) {
  try {
    //console.log("getuserrrr", req.user);
    const id = req.user.id;
    const name = req.user.name;
    console.log("id in getMessage", id);
    console.log("name in getMessage", name);

    const message = await Chat.findAll({ where: { userId: id } });

    return res
      .status(201)
      .json({ success: true, message: message,name:name});
  } catch (error) {
    console.error("Failed to retrieve the chat messages:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve the chat messages" });
  }
}
module.exports = {
  saveMessage: saveMessage,
  getMessage: getMessage,
};
