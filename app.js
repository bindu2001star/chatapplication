const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

const sequelize = require("./util/database");
const { getuserdetails } = require("./util/user-base");
const { addChat } = require("./util/chat-base");
const { storeMultimedia } = require("./util/multimedia");

const userRoutes = require("./Routes/user");
const chatRoutes = require("./Routes/chat");
const GroupRoutes = require("./Routes/Newgroup");
const groupRoute = require("./Routes/group");
const adminRouter = require("./Routes/admin");

const User = require("./model/users");
const Chat = require("./model/chat");
const GroupChat = require("./model/Groupchat");
const Admin = require("./model/Admin");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/newgroup", GroupRoutes);
app.use("/groups", groupRoute);
app.use("/admin", adminRouter);

app.use(express.static(path.join(__dirname, "view")));

User.hasMany(Chat);
Chat.belongsTo(User);

GroupChat.hasMany(Chat);
Chat.belongsTo(GroupChat);

User.belongsToMany(GroupChat, { through: "usergroup" });
GroupChat.belongsToMany(User, { through: "usergroup" });

GroupChat.hasMany(Admin);
User.hasMany(Admin);

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ userId, gpId, userName }) => {
    if (gpId) {
      console.log(`${userName} joined ${gpId}`);
      socket.join(gpId);
      socket.emit("message", {
        userId: -1,
        message: "Welcome to Mchat app",
        gpId: -1,
        name: userName,
      });
      socket.to(gpId).emit("message", {
        userId: -1,
        message: `${userName} has connected to the chat`,
        gpId: -1,
      });
    }
  });

  socket.on("chatMessage", async (data) => {
    console.log("dataa", data);
    if (data.gpId) {
      console.log(data.gpId, "gpIdddd");
      const [formattedData] = await Promise.all([
        getuserdetails(data.userId, data.message),
        addChat(data.gpId, data.message, data.userId),
      ]);
      console.log(formattedData, "formattedddddd");
      socket.to(data.gpId).emit("message", formattedData);
    }
  });
  socket.on("upload", async (fileData, cb) => {
    console.log("file", fileData);
    const fileUrl = await storeMultimedia(
      fileData.fileBuffer,
      fileData.gpId,
      fileData.fileName
    );
    console.log(fileUrl);
    addChat(fileData.gpId, fileUrl, fileData.userId);
    cb(fileUrl);
  });
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("details synced with database");
    server.listen(3004);
  })
  .catch((err) => {
    console.log("details could not be synced with database");
  });
