const express = require("express");
const userAuthentication = require("../middleware/Autherisation");
const groupController = require("../controllers/group");
const router = express.Router();
router.get(
  "/getgroups",
  userAuthentication.authentication,
  groupController.getGroups
);
router.get(
  "/getmembers",
  userAuthentication.authentication,
  groupController.getMembers
);

router.get(
  "/getNonMembers",
  userAuthentication.authentication,
  groupController.getNonMembers
);


module.exports = router;
