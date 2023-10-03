const token = localStorage.getItem("token");
const payload = token.split(".")[1];
const decodedPayload = window.atob(payload);
const decodedToken = JSON.parse(decodedPayload);
const username = decodedToken.name;
const id = decodedToken.userId;
const groupId = localStorage.getItem("groupId");
const groupName = localStorage.getItem("groupName");
const msgform = document.getElementById("groupMessageForm");
msgform.addEventListener("submit", sendMessage);

async function sendMessage(event) {
  event.preventDefault();
  const details = {
    name: username,
    message: document.getElementById("message").value,
    userId: id,
    GroupchatId: groupId,
  };
  try {
    const response = await axios.post(
      `http://localhost:3004/groups/${groupId}/groupChat`,
      details,
      {
        headers: { Authorization: token },
      }
    );
    console.log("Message data sent to the server:", response.data.details);
    showOnScreen(response.data.details);
    msgform.reset();
  } catch (error) {
    console.log("Error in sending message in group", error);
  }
}
function showOnScreen(details) {
  const chatList = document.getElementById("chats");
  const chatItem = document.createElement("li");
  chatItem.textContent = `${details.name}: ${details.message}`;
  chatItem.classList.add("chatMessages");
  chatList.appendChild(chatItem);
}

window.onload = async function () {
  if (groupId) {
    await getMessage(groupId);
    await getGroupMembers(groupId);
    await checkAdmin(groupId);
  }
};
async function checkAdmin(groupId) {
  try {
    const response = await axios.get(
      `http://localhost:3004/groups/${groupId}/checkAdmin`,
      {
        headers: { Authorization: token },
      }
    );
    const admin = response.data;
    console.log(admin, "checking for admin");
    if (admin === 1) {
      const showUsersButton = document.getElementById("showUsersButton");
      showUsersButton.style.display = "block";
      showUsersButton.addEventListener("click", showUsers);

      const makeAdminButton = document.getElementById("makeAdminButton");
      makeAdminButton.style.display = "block;";
      makeAdminButton.addEventListener("click", makeAdmin);

      const removeUserButton = document.getElementById("removeFromGroupButton");
      removeUserButton.style.display = "block;";
      removeUserButton.addEventListener("click", removeUser);
    } else {
      const makeAdminButton = document.getElementById("makeAdminButton");
      makeAdminButton.style.display = "none";

      const removeFromGroupButton = document.getElementById(
        "removeFromGroupButton"
      );
      removeFromGroupButton.style.display = "none";
      const showUsersButton = document.getElementById("showUsersButton");
      showUsersButton.style.display = "none";
    }
  } catch (err) {
    console.log("could not fetch admin");
  }
}
async function getMessage(groupId) {
  event.preventDefault();
  try {
    const response = await axios.get(
      `http://localhost:3004/groups/${groupId}/groupChat`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response, "checking for response from server");
    const details = response.data.messages;
    console.log(details, "checking for details over here");
    const chatList = document.getElementById("chats");
    chatList.innerHTML = "";

    if (details) {
      details.forEach((element) => {
        showOnScreen(element);
      });
    }
  } catch (err) {}
}

const showUsersButton = document.getElementById("showUsersButton");
showUsersButton.style.display = "block";
showUsersButton.addEventListener("click", showUsers);
async function showUsers() {
  try {
    const response = await axios.get("http://localhost:3004/groups/userlist", {
      headers: { Authorization: token },
    });
    console.log(response, "printing response here for userlist ");
    const userList = response.data;
    const dropdown = document.getElementById("userList");
    dropdown.innerHTML = "";
    // const defaultOption = document.createElement("option");
    // defaultOption.value = "";
    // defaultOption.text = "Select a user";
    // dropdown.appendChild(defaultOption);

    userList.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.text = `${user.id} : ${user.name}  : (${user.email} : ${user.phoneNumber})`;
      dropdown.appendChild(option);
    });
    dropdown.style.display = "block";
    dropdown.selectedIndex = 0;
    dropdown.addEventListener("change", async (event) => {
      const selecteduser = event.target.value;
      const selectedusername =
        event.target.options[event.target.selectedIndex].text.split(":")[1];

      console.log("selecteddddd", selectedusername);
      console.log("selectedIndexxxxxxxxx", dropdown.selectedIndex);

      try {
        const details = {
          groupId: localStorage.getItem("groupId"),
          userId: selecteduser,
          groupName: localStorage.getItem("groupName"),
          userName: selectedusername,
        };
        console.log("checking for group name", details);
        const addResponse = await axios.post(
          "http://localhost:3004/groups/adduser",
          details,
          {
            headers: { Authorization: token },
          }
        );
        console.log("User added to group:", addResponse.data);
        dropdown.style.display = "none";
      } catch (addError) {
        console.log("Error adding user to group:", addError);
      }
    });
    // dropdown.style.display = "block"; // Show the dropdown
    //dropdown.dispatchEvent(new Event("change"));
  } catch (addError) {
    console.log("Error adding user to group:", addError);
  }
}

async function makeAdmin() {
  try {
    const dropdown = document.getElementById("MembersDropdown");
    const userId = dropdown.options[dropdown.selectedIndex].value;
    const details = {
      userId: userId,
    };
    console.log(details, "printing the details here");
    const response = await axios.put(
      `http://localhost:3004/groups/${groupId}/makeAdmin`,
      details,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response, " congratulations admin");
  } catch (err) {}
}

async function getGroupMembers() {
  try {
    const response = await axios.get(
      `http://localhost:3004/groups/${groupId}/groupMembers`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response, "printing group member details");
    MembersDropdown(response.data);
  } catch (error) {
    console.log(error, "error in getting group members");
  }
}
function MembersDropdown(groupMembers) {
  const dropdown = document.getElementById("MembersDropdown");
  dropdown.innerHTML = "";
  groupMembers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.UserId;
    option.text = `${user.id} : ${user.NameOfUser} `;
    dropdown.appendChild(option);
  });

  const groupDropdown = document.getElementById("groupDropdown");
  groupDropdown.addEventListener("change", async (event) => {
    const selectedGroupId = localStorage.getItem("groupId");
    groupId = selectedGroupId;
    await getMessage(groupId);
  });
}

const removeUserButton = document.getElementById("removeFromGroupButton");
removeUserButton.style.display = "block";
removeUserButton.addEventListener("click", removeUser);
async function removeUser() {
  const dropdown = document.getElementById("MembersDropdown");
  const userId = dropdown.options[dropdown.selectedIndex].value;
  console.log("userId of the user that is to be deleted", userId);
  console.log("selectedIndexxxxxxxxx", dropdown.selectedIndex);
  try {
    const details = {
      userId: userId,
    };
    const response = await axios.post(
      `http://localhost:3004/groups/${groupId}/removeUser`,
      details,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response, "printing reponse after deleting user");
  } catch (error) {
    console.log(error, "error while deleting data");
  }
}

async function Logout(event) {
  localStorage.clear();
  window.location.href = "../Login/login.html";
}
