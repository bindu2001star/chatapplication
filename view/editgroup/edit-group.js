const baseUrl = "http://localhost:3004";

// DOM selections
const token = localStorage.getItem("token");
const logout = document.getElementById("logout");
const form = document.getElementById("groupDetailsForm");
const userModal = document.getElementById("users-model");
const groupForm = document.getElementById("group-form");
const msg = document.getElementById("message");
const userList = document.getElementById("user-list");
const groupList = document.getElementById("group-list");
const menuBtn = document.getElementById("menu-btn");
const saveBtn = document.getElementById("save");
const groupName = document.getElementById("group-name");
const groupNameInput = document.getElementById("groupNameinput");
const brand = document.getElementById("brand");

if (!token) {
  window.location.href = "../index.html";
}

// SIDEBAR LOGIC
logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
});

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

const currentUser = parseJwt(token);

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};



const openGroupChat = (e) => {
  const gpId = e.target.id;
  const gpName = e.target.innerText;
  localStorage.setItem("currentGpId", gpId);
  localStorage.setItem("currentGpName", gpName);
  window.location.href = "../chathome/home.html";
};

const displayGroups = (group) => {
  const li = document.createElement("li");
  li.className = "list-group-item users";
  li.id = group.id;
  li.appendChild(document.createTextNode(group.name));
  li.addEventListener("click", openGroupChat);
  groupList.appendChild(li);
};

const getGroups = async () => {
  const gpName = localStorage.getItem("newGroupName");
  groupName.appendChild(document.createTextNode(gpName));
  try {
    const response = await axios.get(`${baseUrl}/groups/getgroups`, {
      headers: { Authorization: token },
    });
    const groups = response.data.groups;
    groups.forEach((group) => {
      displayGroups(group);
    });
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const gpName = localStorage.getItem("newGroupName");
  groupNameInput.value = gpName;
  getGroups();
  getUsers();
});

const getUsers = async () => {
  userList.replaceChildren();
  // get members first
  const gpId = localStorage.getItem("newGroupId");
  try {
    const response = await axios.get(
      `${baseUrl}/groups/getMembers?gpId=${gpId}`,
      {
        headers: { Authorization: token },
      }
    );
    const { members: users } = response.data;
    users.forEach((user) => {
      displayUsers(user, true);
    });
  } catch (error) {
    console.log(error);
  }

  //get non members
  try {
    const response = await axios.get(
      `${baseUrl}/groups/getNonMembers?gpId=${gpId}`,
      {
        headers: { Authorization: token },
      }
    );
    const { users } = response.data;
    users.forEach((user) => {
      displayUsers(user, false);
    });
  } catch (error) {
    console.log(error);
  }
};

const displayUsers = (user, isMember) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");
  li.id = user.id;
  li.className = "list-group-item";
  if (currentUser.userId=== user.id) {
    span.appendChild(document.createTextNode("You"));
  } else {
    span.appendChild(document.createTextNode(user.name));
  }
  button.className = "btn add";
  if (isMember) {
    const AdminButton = document.createElement("button");
    if (currentUser.userId === user.id) {
      button.appendChild(document.createTextNode("Exit Group"));
    } else {
      button.appendChild(document.createTextNode("Remove"));
    }
      button.addEventListener("click", deleteUserHandler);
    AdminButton.className = "btn add btn-admin";

    if (user.isAdmin) {
      AdminButton.appendChild(document.createTextNode("Remove Admin"));
      AdminButton.addEventListener("click", removeAdminHandler);
    } else {
      AdminButton.appendChild(document.createTextNode("Make Admin"));
      AdminButton.addEventListener("click", makeAdminHandler);
    }
    li.appendChild(span);
    li.appendChild(button);
    li.appendChild(AdminButton);
    userList.appendChild(li);
  } else {
    button.appendChild(document.createTextNode("Add"));
    button.addEventListener("click", addUserHandler);
    li.appendChild(span);
    li.appendChild(button);
    userList.appendChild(li);
  }
};

const addUserHandler = async (e) => {
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  try {
    await axios.get(
      `${baseUrl}/newgroup/add-user?gpId=${gpId}&userId=${userId}`,
      { headers: { Authorization: token } }
    );

    getUsers();
  } catch (error) {
    console.log(error);
  }
};

const submitHandler = async (e) => {
  e.preventDefault();
  const groupName = e.target.groupName;
  if (groupName.value === "") {
    messageHandler("Please Enter the name", "error");
  } else {
    const postDetails = {
      groupName: groupName.value,
    };
    try {
      const gpId = localStorage.getItem("newGroupId");
      await axios.post(
        `${baseUrl}/newgroup/edit-group?gpId=${gpId}`,
        postDetails,
        {
          headers: { Authorization: token },
        }
      );
      console.log("updating")
      localStorage.setItem("newGroupId", gpId);
      localStorage.setItem("newGroupName", groupName.value);
      messageHandler("Updated Group Name", "success");
    } catch (error) {
      console.log(error);
    }
  }
};

form.addEventListener("submit", submitHandler);

async function makeAdminHandler(e) {
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  
  try {
    await axios.get(`${baseUrl}/admin?gpId=${gpId}&userId=${userId}`, {
      headers: { Authorization: token },
    });
    console.log("makeadminnnnnnhandler")
    getUsers();
    
  } catch (error) {
    console.log(error);
  }
}

async function removeAdminHandler(e) {
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  try {
    await axios.delete(`${baseUrl}/admin?gpId=${gpId}&userId=${userId}`, {
        headers: { Authorization: token },
    });
    getUsers();
  } catch (error) {
    console.log(error);
  }
}

const deleteUserHandler = async (e) => {
    const li = e.target.parentElement;
    const gpId = localStorage.getItem("newGroupId");
    const userId = li.id;
    try {
      await axios.delete(
        `${baseUrl}/newgroup/delete-user?gpId=${gpId}&userId=${userId}`,
        {headers: { Authorization: token } }
      );
      if (
        e.target.innerText === "Exit Group" &&
        e.target.previousSibling.innerText === "Remove Admin"
      ) {
        await axios.delete(
          `${baseUrl}/admin/remove-admin?gpId=${gpId}&userId=${userId}`,
          { headers: { Authorization: token } }
        );
      }
      if (currentUser.userId === +userId) {
        alert("You have exited the group");
        localStorage.removeItem("currentGpId");
        localStorage.removeItem("currentGpName");
        window.location.href = "../chathome/home.js";
      } else {
        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

saveBtn.addEventListener("click", () => {
    const gpId = localStorage.getItem("newGroupId");
    const gpName = localStorage.getItem("newGroupName");
    localStorage.setItem("currentGpId", gpId);
    localStorage.setItem("currentGpName", gpName);
    window.location.href = "../chathome/home.html";
  });