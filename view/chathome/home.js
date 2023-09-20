const msgform = document.getElementById("messageForm");

const token = localStorage.getItem("token");

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
    console.log("response.log", response.data);

    showafterDomContentload({
      name: response.data.name,
      message: response.data.message.message,
    });

    // setInterval(() => {
    //   location.reload();
    // }, 1000);
    msgform.reset();
  } catch (error) {
    console.log("Error in sending message", error);
  }
}

// function showOnScreen(details) {
//   const chatList = document.getElementById("chats");
//   const chatItem = document.createElement("li");
//   chatItem.textContent = `${details.Name}: ${details.newMessage.message}`;
//   chatList.appendChild(chatItem);
// }
function showafterDomContentload(element) {
  const chatList = document.getElementById("chats");
  const chatItem = document.createElement("li");
  chatItem.textContent = `${element.name}:${element.message}`;
  chatList.appendChild(chatItem);
}

window.onload = async function () {
  await getMessage();
};

async function getMessage(req, res, next) {
  let lastmsg = localStorage.getItem("lastmsgg");
  if (!lastmsg) {
    lastmsg = -1;
  }
  console.log("lastmsgg", lastmsg);
  try {
    const response = await axios.get(
      `http://localhost:3004/message/Chat?lastmsg=${lastmsg}`,
      {
        headers: { Authorization: token },
      }
    );

    const details = response.data.message;

    console.log("while getting messages on domcontentload", details);
    //localStorage.setItem('message',details);
    const chatList = document.getElementById("chats");
    chatList.innerHTML = "";
    console.log("detailsss", details);
    lastmsg = details[details.length - 1].id;
    localStorage.setItem("lastmsgg", lastmsg);
    if (details.length) {
      let existingmsgs = JSON.parse(localStorage.getItem("message"));
      if (!existingmsgs) {
        existingmsgs = [];
      }
      const newMessage = [...existingmsgs, ...details];
      while (newMessage.length > 10) {
        newMessage.shift();
      }
      localStorage.setItem("message", JSON.stringify(newMessage));
    }
    const messages = JSON.parse(localStorage.getItem("message"));
    messages.forEach((element) => {
      showafterDomContentload(element);
    });
    // if (Array.isArray(details)) {
    //   details.forEach((element) => {
    //     showafterDomContentload(element);
    //   });
    // } else {
    //   console.error("response.data.message is not an array");
    // }
  } catch (err) {
    console.log("error  while getting messages", err);
  }
}
