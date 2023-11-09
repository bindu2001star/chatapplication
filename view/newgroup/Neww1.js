const baseUrl = "http://localhost:3004";

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
const brand = document.getElementById("brand");

if (!token) {
  window.location.href = "../index.html";
}

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
document.addEventListener("DOMContentLoaded", getGroups);

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
      const response = await axios.post(
        `${baseUrl}/newgroup/groupname`,
        postDetails,
        {
          headers: { Authorization: token },
        }
      );
      console.log("response while adding group", response);
      const gpId = response.data.gp.id;
      const gpName = response.data.gp.name;
      localStorage.setItem("newGroupId", gpId);
      localStorage.setItem("newGroupName", gpName);
      groupName.value = "";
      groupForm.style.display = "none";
      userModal.style.display = "block";
      getUsers();
    } catch (err) {
      console.log("Error while adding GroupName", err);
    }
  }
};
form.addEventListener("submit", submitHandler);

const getUsers = async () => {
  userList.replaceChildren();
  try {
    const response = await axios.get(`${baseUrl}/newgroup/users/getUsers`, {
      headers: { Authorization: token },
    });
    const { users } = response.data;
    console.log("getting users in neww1.js",users)
    users.forEach((user) => {
      displayUsers(user);
    });
  } catch (error) {
    console.log(error);
  }
};

const displayUsers = (user) => {
  if (currentUser.id !== user.id) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
   
    li.id = user.id;
    li.className = "list-group-item";
    span.appendChild(document.createTextNode(user.name));
    button.className = "btn add";
    button.appendChild(document.createTextNode("Add"));
    button.addEventListener("click", addUserHandler);
    li.appendChild(span);
    li.appendChild(button);
    userList.appendChild(li);
  }
};

const addUserHandler = async (e) => {
  const btn = e.target;
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  try {
    await axios.get(
      `${baseUrl}/newgroup/add-user?gpId=${gpId}&userId=${userId}`,
      { headers: { Authorization: token } }
    );
    const makeAdminBtn = document.createElement("button");
    makeAdminBtn.className = "btn btn-admin add";
    makeAdminBtn.appendChild(document.createTextNode("Make Admin"));
    makeAdminBtn.addEventListener("click", makeAdminHandler);
    li.appendChild(makeAdminBtn);
    btn.innerText = "Remove";
    btn.removeEventListener("click", addUserHandler);
    btn.addEventListener("click", deleteUserHandler);
  } catch (error) {
    console.log(error);
  }
};

const deleteUserHandler = async (e) => {
  const btn = e.target;
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  try {
    await axios.delete(
      `${baseUrl}/newgroup/delete-user?gpId=${gpId}&userId=${userId}`,
      { headers: { Authorization: token } }
    );
    btn.textContent = "Add";
    btn.removeEventListener("click", deleteUserHandler);
    btn.addEventListener("click", addUserHandler);
  } catch (error) {
    console.log(error);
  }
};

async function makeAdminHandler(e) {
  const btn = e.target;
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  try {
    await axios.get(`${baseUrl}/admin?gpId=${gpId}&userId=${userId}`, {
      headers: { Authorization: token },
    });
    btn.innerText = "Remove Admin";
    btn.removeEventListener("click", makeAdminHandler);
    btn.addEventListener("click", removeAdminHandler);
  } catch (error) {
    console.log(error);
  }
}

async function removeAdminHandler(e) {
  const btn = e.target;
  const li = e.target.parentElement;
  const gpId = localStorage.getItem("newGroupId");
  const userId = li.id;
  try {
    await axios.delete(`${baseUrl}/admin?gpId=${gpId}&userId=${userId}`, {
      headers: { Authorization: token },
    });
    btn.innerText = "Make Admin";
    btn.removeEventListener("click", removeAdminHandler);
    btn.addEventListener("click", makeAdminHandler);
  } catch (error) {
    console.log(error);
  }
}

saveBtn.addEventListener("click", () => {
  const gpId = localStorage.getItem("newGroupId");
  const gpName = localStorage.getItem("newGroupName");
  localStorage.setItem("currentGpId", gpId);
  localStorage.setItem("currentGpName", gpName);
  window.location.href = "../chathome/home.html";
});
