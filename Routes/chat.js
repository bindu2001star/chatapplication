const express=require('express');
const chatController=require("../controllers/chat");
const userAuth=require("../middleware/Autherisation");
const router=express.Router();
router.post('/chats',userAuth.authentication,chatController.saveMessage);

module.exports=router;

