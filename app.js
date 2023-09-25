const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

const sequelize = require("./util/database");

const userRoutes = require("./Routes/user");
const chatRoutes = require("./Routes/chat");
const GroupRoutes = require("./Routes/Newgroup");
const groupRoute=require("./Routes/group");

const User = require("./model/users");
const Chat = require("./model/chat");
const GroupChat = require("./model/Groupchat");


app.use("/user", userRoutes);
app.use("/message", chatRoutes);
app.use("/newgroup", GroupRoutes);
app.use("/groups",groupRoute);

app.use(express.static(path.join(__dirname, "view")));

User.hasMany(Chat);
Chat.belongsTo(User);

GroupChat.hasMany(Chat);
Chat.belongsTo(GroupChat);


sequelize
  .sync({ force: false})
  .then(() => {
    console.log("details synced with database");
  })
  .catch((err) => {
    console.log("details could not be synced with database");
  });


app.listen(3004);
