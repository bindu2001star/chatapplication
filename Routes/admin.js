const express = require("express");
const userAuthentication = require("../middleware/Autherisation");
const router = express.Router();
const admincontroller = require("../controllers/admin");

router.get("/", userAuthentication.authentication, admincontroller.makeAdmin);
router.delete(
  "/",
  userAuthentication.authentication,
  admincontroller.removeAdmin
);


module.exports = router;
