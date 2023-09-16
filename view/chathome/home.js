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
    //showafterDomContentload(response.data.details);
    setInterval(() => {
      location.reload();
    }, 1000);
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
  try {
    const response = await axios.get("http://localhost:3004/message/Chat", {
      headers: { Authorization: token },
    });

    const details = response.data.message;
    console.log("while getting messages on domcontentload", details);
    const chatList = document.getElementById("chats");
    chatList.innerHTML = "";
    if (Array.isArray(details)) {
      details.forEach((element) => {
        showafterDomContentload(element);
      });
    } else {
      console.error("response.data.message is not an array");
    }
  } catch (err) {
    console.log("error  while getting messages", err);
  }
}
