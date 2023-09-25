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
  "/groupname",
  userAuthentication.authentication,
  NewGroupController.getgroupList
);


module.exports = router;
