const Chat=require('../model/chat');
const User=require('../model/users');


async function saveMessage(req,res){
    const {message}=req.body;
    try{
        const newMessage=await Chat.create({
            name:req.user.name,
            message:message,
            userId:req.user.id
        });
        res.status(201).json({ success: true, message: 'Message saved successfully', details: newMessage });


    }catch(error){
        console.error('Failed to save the chat message:', error);
      res.status(500).json({ success: false, error: 'Failed to save the chat message' });

    }

}
module.exports={
    saveMessage:saveMessage
}