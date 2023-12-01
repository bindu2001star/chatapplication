const baseUrl = "http://3.80.199.53:3004";
const socket = io();

const token = localStorage.getItem("token");
const form = document.getElementById("send-message");
const tableBody = document.getElementById("table-body");
const profile = document.getElementById("profile");
const newGroup = document.getElementById("newgroup");
const groupList = document.getElementById("group-list");
const menuBtn = document.getElementById("menu-btn");
const messageContainer = document.getElementById("message-container");
const memberCount = document.getElementById("member-count");
const membersList = document.getElementById("members-list");
const brand = document.getElementById("brand");
const header = document.querySelector(".header");
const settings = document.getElementById("settings");
const info = document.getElementById("info");
const infoDiv = document.getElementById("info-div");
const logout = document.getElementById("logout");
const fileInput = document.getElementById("file");
if (!token) {
  window.location.href = "../Login/login.html";
}
newGroup.addEventListener("click", () => {
  window.location.href = "../newgroup/newgroup.html";
});

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentGpId");
  localStorage.removeItem("newGroupId");
  localStorage.removeItem("messages");
  localStorage.removeItem("newGroupName");
  localStorage.removeItem("currentGpName");
  window.location.href = "../Login/login.html";
});

const currentUser = parseJwt(token);

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const displayGroups = (group) => {
  const li = document.createElement("li");
  li.className = "list-group";
  li.id = group.id;
  li.appendChild(document.createTextNode(group.name));
  li.addEventListener("click", openGroupChat);
  groupList.appendChild(li);
};

const onLoad = async () => {
  const gpName = localStorage.getItem("currentGpName");
  const gpId = localStorage.getItem("currentGpId");
  profile.replaceChildren(gpName);
  header.style.display = "none";
  if (gpId) {
    getMembers();
  }
  getGroups();
  await getChats();
  socket.emit("joinRoom", {
    userId: currentUser.userId,
    gpId: gpId,
    userName: currentUser.name,
  });
};
window.addEventListener("DOMContentLoaded", onLoad);

const openGroupChat = async (e) => {
  const currentGpId = localStorage.getItem("currentGpId");
  socket.emit("leaveRoom", {
    userId: currentUser.userId,
    gpId: currentGpId,
    userName: currentUser.name,
  });

  const gpId = e.target.id;
  const gpName = e.target.innerText;
  localStorage.setItem("currentGpId", gpId);

  localStorage.setItem("currentGpName", gpName);
  profile.replaceChildren();
  profile.appendChild(document.createTextNode(gpName));
  header.style.display = "flex";
  menuBtn.click();
  form.style.display = "flex";

  getMembers();
  await getChats();

  socket.emit("joinRoom", {
    userId: currentUser.userId,
    gpId: gpId,
    userName: currentUser.name,
  });
};
const getGroups = async () => {
  try {
    const response = await axios.get(`${baseUrl}/groups/getgroups`, {
      headers: { Authorization: token },
    });
    const groups = response.data.groups;
    groups.forEach((group) => {
      displayGroups(group);
    });
  } catch (err) {
    console.log("Error while getting groups", err);
  }
};

const submitHandler = async (e) => {
  e.preventDefault();
  const gpId = localStorage.getItem("currentGpId");
  const msg = e.target.message;
  const chat = {
    userId: currentUser.userId,
    gpId: gpId,
    message: msg.value,
    name: currentUser.name,
  };
  console.log("userId in submithandler", currentUser.userId);
  socket.emit("chatMessage", chat);
  displayChats(chat);
  msg.value = "";
};

form.addEventListener("submit", submitHandler);

const getChats = async () => {
  tableBody.replaceChildren();
  const gpId = localStorage.getItem("currentGpId");
  if (gpId) {
    header.style.display = "flex";
    form.style.display = "block";
    let localMessages = JSON.parse(localStorage.getItem("messages"));
    let gpMessages =
      localMessages && localMessages[gpId] ? localMessages[gpId] : [];
    const lastMsgId = gpMessages.length
      ? gpMessages[gpMessages.length - 1].id
      : -1;
    console.log("gpmessages111", gpMessages);
    console.log("lastmsgg", lastMsgId);
    try {
      const response = await axios.get(
        `${baseUrl}/chat/chats?lastMsgId=${lastMsgId}&gpId=${gpId}`,
        {
          headers: { Authorization: token },
        }
      );
      const chats = response.data.chats;
      console.log("chattts", chats);
      gpMessages = gpMessages ? [...gpMessages, ...chats] : [...chats];
      if (gpMessages.length) {
        while (gpMessages.length > 10) {
          gpMessages.shift();
        }
        gpMessages.forEach((chat) => {
          displayChats({
            userId: chat.userId,
            message: chat.chat,
            gpId: chat.GroupchatId,
          userName: chat.user.name,
          });
        });
        console.log("gpId", gpId);
        localMessages = localMessages ? localMessages : {};
        localMessages[gpId] = gpMessages;
        localStorage.setItem("messages", JSON.stringify(localMessages));
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    tableBody.innerHTML = `
    <li class="list-group-item">
        <h1 class='heading'>Welcome to Chat App</h1>
    </li>
    <li class="list-group-item">
        <h3 style="text-align: center">Create groups to start Chat or open groups to chat</h3>
    </li>`;
  }
};

const displayChats = (chat) => {
  const { userId, message, userName } = chat;

  const currentUser = parseJwt(token);
  const li = document.createElement("li");
  let formattedMessage;
  if (message.includes("https://")) {
    formattedMessage = `<div class="chat-image">
                          <img src=${message} alt="image" />
                        </div>`;
  } else {
    formattedMessage = message;
  }
  if (currentUser.userId === userId) {
    li.className = "list-group-item you-list";
    li.innerHTML = `<div class="rounded shadow-sm you">
                      ${formattedMessage}
                    </div>`;
  } else if (userId === -1) {
    li.className = "list-group-item";
    li.innerHTML = `<div class="botDiv">
                      <span class="spanName botName">${userName}:</span>
                      <span class="botMessage">${formattedMessage}</span>
                    </div>`;
  } else {
    li.className = "list-group-item";
    li.innerHTML = `<div class="others rounded shadow-sm">
                    <span class="spanName">${userName}</span>
                    <span class="spanMessage">${formattedMessage}</span>
                    </div>`;
  }
  tableBody.appendChild(li);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const getMembers = async () => {
  const gpId = localStorage.getItem("currentGpId");
  membersList.replaceChildren();
  try {
    const response = await axios.get(
      `${baseUrl}/groups/getmembers?gpId=${gpId}`,
      {
        headers: { Authorization: token },
      }
    );
    const { members: users } = response.data;
    console.log("responseeee", response.data);
    const userCount = users.length;
    memberCount.replaceChildren(document.createTextNode(userCount));

    users.forEach((user) => {
      const li = document.createElement("li");
      const spanName = document.createElement("span");
      const spanStatus = document.createElement("span");
      li.id = user.id;
      li.className = "list-group-item";
      spanName.className = "member-name";

      if (currentUser.userId === user.id) {
        spanName.appendChild(document.createTextNode("You"));
      } else {
        spanName.appendChild(document.createTextNode(user.name));
      }
      if (user.isAdmin) {
        if (user.id === currentUser.userId) {
          settings.style.display = "block";
        }
        spanStatus.className = "status admin";
        spanStatus.appendChild(document.createTextNode("Admin"));
      } else {
        spanStatus.className = "status member";
        spanStatus.appendChild(document.createTextNode("Member"));
      }

      li.appendChild(spanName);
      li.appendChild(spanStatus);
      membersList.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
};

settings.addEventListener("click", () => {
  const gpId = localStorage.getItem("currentGpId");
  const gpName = localStorage.getItem("currentGpName");
  localStorage.setItem("newGroupId", gpId);
  localStorage.setItem("newGroupName", gpName);
  window.location.href = "../editgroup/edit-group.html";
});

socket.on("message", (data) => {
  console.log("///", data);
  displayChats(data);
});

const handleInfo = () => {
  const infoDisplayInfo = infoDiv.style.display;
  if (infoDisplayInfo !== "block") {
    getMembers();
    infoDiv.style.display = "block";
  } else {
    infoDiv.style.display = "none";
  }
};

info.addEventListener("click", handleInfo);

brand.addEventListener("click", () => {
  header.style.display = "none";
  localStorage.removeItem("currentGpId");
  localStorage.removeItem("currentGpName");
  menuBtn.click();
  getChats();
  form.style.display = "none";
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const gpId = localStorage.getItem("currentGpId");
  if (file) {
    const reader = new FileReader();
    // Create a JSON object containing the file name and the file buffer
    reader.onload = () => {
      const fileData = {
        gpId: gpId,
        userId: currentUser.userId,
        fileName: file.name,
        fileBuffer: reader.result,
      };
      // Send the file data to the server through the socket
      socket.emit("upload", fileData, (fileUrl) => {
        displayChats({
          userId: currentUser.userId,
          message: fileUrl,
          name: currentUser.name,
        });
      });
    };
    reader.readAsArrayBuffer(file);
  }
});
