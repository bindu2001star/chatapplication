const msgform = document.getElementById("messageForm");

const token = localStorage.getItem("token");
const payload = token.split(".")[1];
const decodedPayload = window.atob(payload);
const decodedToken = JSON.parse(decodedPayload);

const username = decodedToken.name;
const id = decodedToken.userId;

async function sendmeassage(event) {
  event.preventDefault();

  const details = {
    name: username,
    message: document.getElementById("message").value,
    userId: id,
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
    showOnScreen(response.data.details);
  } catch (error) {
    console.log("Error in sending message", error);
  }
}
function showOnScreen(details) {
  const chatList = document.getElementById("chats");
  const chatItem = document.createElement("li");
  chatItem.textContent = `${details.name}: ${details.message}`;
  chatList.appendChild(chatItem);
}
