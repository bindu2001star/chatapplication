const ArchiveChat = require("../model/ArchiveChats");
const chat = require("../model/chat");
exports.moveChatToArchive = async () => {
  const chats = await chat.findAll();
  chats.forEach(async (chat) => {
    await ArchiveChat.create({
      message: chat.chat,
      userId: chat.userId,
      GroupchatId: chat.GroupchatId,
    });
  });
  await chat.destroy({
    where: {},
    truncate: true,
  });
};
