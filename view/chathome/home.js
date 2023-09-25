const msgform = document.getElementById("messageForm");
const msg = document.getElementById("message1");

const token = localStorage.getItem("token");

// newgroup.addEventListener("click", () => {
//   window.location.href="../newgroup/newgroup.html";
// });
const createGroupButton = document.getElementById("createGroup");
createGroupButton.addEventListener("click", createGroup);

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

async function sendMessage(event) {
  event.preventDefault();

  const details = {
    message: document.getElementById("message").value,
  };
  try {
    const response = await axios.post(
      "http://localhost:3004/message/Chats",
      details,
      {
        headers: { Authorization: token },
      }
    );
    console.log("Message data sent to the server", response.data.details);
    //console.log("response.log", response.data);

    showafterDomContentload({
      name: response.data.name,
      message: response.data.message.message,
    });

    setInterval(() => {
      location.reload();
    }, 1000);
    msgform.reset();
  } catch (error) {
    console.log("Error in sending message", error);
  }
}

function showafterDomContentload(element) {
  const chatList = document.getElementById("chats");
  const chatItem = document.createElement("li");
  chatItem.textContent = `${element.name}:${element.message}`;
  chatList.appendChild(chatItem);
}

window.onload = async function () {
  await getMessage();
  showAllGroups();
};

async function getMessage(req, res, next) {
  let lastmsg = localStorage.getItem("lastmsgg");
  if (!lastmsg) {
    lastmsg = -1;
  }
  console.log("lastmsgg", lastmsg);
  const GroupchatId=null;
  try {
    const response = await axios.get(
      `http://localhost:3004/message/Chat?lastmsg=${lastmsg}`,
      {
        headers: { Authorization: token },
        //params: { GroupchatId: null },
      }
    );
    //&GroupchatId=${GroupchatId}
    const details = response.data.message;
    //console.log("while getting messages on domcontentload", details);

    if (!details.length) {
      console.log("no msg yet");
    } else {
      lastmsg = details[details.length - 1].id;

      localStorage.setItem("lastmsgg", lastmsg);
      if (details.length) {
        let existingmsgs = JSON.parse(localStorage.getItem("message"));
        console.log("existtt", existingmsgs);
        if (!existingmsgs) {
          existingmsgs = [];
        }
        const newMessage = [...existingmsgs, ...details];
        while (newMessage.length > 10) {
          newMessage.shift();
        }
        localStorage.setItem("message", JSON.stringify(newMessage));
      }
    }

    const messages = JSON.parse(localStorage.getItem("message"));
    console.log("parsing", messages);
    messages.forEach((element) => {
      showafterDomContentload(element);
    });
  } catch (err) {
    console.log("error  while getting messages", err.message);
  }
}

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

async function createGroup(event) {
  console.log("create group name");
  event.preventDefault();
  const groupName = prompt("Enter group name:");
  if (groupName === "") {
    messageHandler("Please Enter the name", "error");
  } else {
    const postDetails = {
      groupName: groupName,
    };
    console.log("group name in js", postDetails);
    try {
      const response = await axios.post(
        "http://localhost:3004/newgroup/groupname",
        postDetails,
        {
          headers: { Authorization: token },
        }
      );

      if (response.Status === 401) {
        console.log("Group already exists");
        //messageHandler("Group already exist", "error");
      } else {
        //console.log("response in  newgroupadding ", response);
        const groupId = response.data.group.id;
        const groupName = response.data.group.name;

        location.reload();
      }
    } catch (error) {
      console.log("Error creating group:", error);
    }
  }
}

async function showAllGroups() {
  try {
    const response = await axios.get(
      "http://localhost:3004/newgroup/groupname",
      {
        headers: { Authorization: token },
      }
    );
    console.log(response, "consoling response");
    const groups = response.data.groups;
    console.log(groups, " consoling the groups");
    const groupList = document.getElementById("group-list");
    groupList.innerHTML = "";
    if (Array.isArray(groups)) {
      groups.forEach((group) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = group.GroupName;
        link.href = `../newgroup/newgroup.html`;
        link.setAttribute("id", group.GroupId);
        console.log("link", link);
        listItem.appendChild(link);
        groupList.appendChild(listItem);

        link.addEventListener("click", function linkActive(event) {
          event.preventDefault();
          const groupName = group.GroupName;
          console.log(groupName, "printing group name here");
          const groupId = link.getAttribute("id");
          console.log(groupId, " checking for the id");
          localStorage.setItem("groupId", groupId);
          localStorage.setItem("groupName", groupName);
          window.location.href = `../newgroup/newgroup.html`;
        });
      });
    } else {
      console.log("groups is not an array");
    }
  } catch (error) {
    console.log("Error fetching groups:", error);
  }
}
