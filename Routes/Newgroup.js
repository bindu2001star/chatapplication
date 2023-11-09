const express = require("express");
const userAuthentication = require("../middleware/Autherisation");
const NewGroupController = require("../controllers/newgroup");
const router = express.Router();
router.post(
  "/groupname",
  userAuthentication.authentication,
  NewGroupController.PostNewGroup
);
router.get(
  "/users/getUsers",
  userAuthentication.authentication,
  NewGroupController.getUsers
);
router.get(
  "/add-user",
  userAuthentication.authentication,
  NewGroupController.addUserToGroup
);
router.delete(
  "/delete-user",
  userAuthentication.authentication,
  NewGroupController.deleteUserFromGroup
);

router.post(
  "/edit-group",
  userAuthentication.authentication,
 NewGroupController.postUpdateGroup
);


module.exports = router;
