const Chat=require("../model/chat");
exports.addChat=async(groupchatId,message,userId)=>{
    await Chat.create({
        chat:message,
        userId:userId,
        GroupchatId:groupchatId,
    });
    return;
}