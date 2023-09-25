const express = require("express");
const userAuthentication = require("../middleware/Autherisation");
const groupController = require("../controllers/group");
const router = express.Router();
router.post(
  "/:groupId/groupChat",
  userAuthentication.authentication,
  groupController.saveMessageingroup
);
router.get(
  "/:groupId/groupChat",
  userAuthentication.authentication,
  groupController.getMessageingroup
);
router.get(
  "/userlist",
  userAuthentication.authentication,
  groupController.getUsers
);
router.post(
  "/adduser",
  userAuthentication.authentication,
  groupController.AddtoGroup
);
router.get(
  "/:groupId/groupMembers",
  userAuthentication.authentication,
  groupController.getMembers
);
router.post(
  "/:groupId/removeUser",
  userAuthentication.authentication,
  groupController.removeUser
);
module.exports = router;
