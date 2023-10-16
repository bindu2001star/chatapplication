// const token = localStorage.getItem("token");
// const form = document.getElementById("newgroupForm");
// const userModel = document.getElementById("users-model");
// const groupForm = document.getElementById("group-form");
// const saveBtn = document.getElementById("save");
// const brand = document.getElementById("brand");
// const msg = document.getElementById("message");
// const userList = document.getElementById("user-list");
// const groupname = document.getElementById("group-name");
// const usersselected = document.getElementById("users1");

// // const messageHandler = (message, type) => {
// //   msg.innerText = message;
// //   msg.className = type;
// //   setTimeout(() => {
// //     msg.innerText = "";
// //     msg.className = "";
// //   }, 5000);
// // };

// function parseJwt(token) {
//   var base64Url = token.split(".")[1];
//   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }

// // const submitgroupname = async (e) => {
// //   e.preventDefault();
// //   const groupName = e.target.groupName;
// //   if (groupName.value === "") {
// //     messageHandler("Please Enter the name", "error");
// //   } else {
// //     const postDetails = {
// //       groupName: groupName.value,
// //     };
// //     try {
// //       const response = await axios.post(
// //         "http://localhost:3004/newgroup/groupname",
// //         postDetails,
// //         {
// //           headers: { Authorization: token },
// //         }
// //       );
// //       console.log("response in  newgroupadding ", response);
// //       const groupId = response.data.group.id;
// //       const groupName = response.data.group.name;
// //       localStorage.setItem("newGroupId", groupId);
// //       localStorage.setItem("newGroupName", groupName);
// //       groupName.value = " ";
// //       //form.reset();
// //       groupname.appendChild(document.createTextNode(groupName));
// //       groupForm.style.display = "none";
// //       userModel.style.display = "block";

// //       getUsers();
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   }
// // };

// form.addEventListener("submit", submitgroupname);
// // form.onload = () => {
// //   getUsers();
// // };

// const getUsers = async (e) => {
//   //userList.replaceChildren();
//   try {
//     const response = await axios.get(
//       "http://localhost:3004/newgroup/getUsers",
//       {
//         headers: { Authorization: token },
//       }
//     );
//     console.log(response, "get users response");
//     const users = response.data.users;

//     users.forEach((users) => {
//       dissplayusers(users);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// const dissplayusers = (user) => {
//   const li = document.createElement("li");
//   const span = document.createElement("span");
//   const button = document.createElement("button");
//   li.id = user.id;
//   li.dataset.name = user.name;
//   span.appendChild(document.createTextNode(user.name));
//   button.appendChild(document.createTextNode("Add"));
//   button.addEventListener("click", Adduser);
//   li.appendChild(span);
//   li.appendChild(button);
//   userList.appendChild(li);
// };
// const Adduser = async (e) => {
//   const btn = e.target;
//   const li = e.target.parentElement;
//   const groupId = localStorage.getItem("newGroupId");
//   const userId = li.id;
//   const groupName = localStorage.getItem("newGroupName");
//   const dataNameValue = li.getAttribute("data-name");
//   console.log("usernmaeee", dataNameValue);
//   const Addusertogroup = {
//     groupName: groupName,
//     dataNameValue: dataNameValue,
//   };
//   try {
//     const response = await axios.post(
//       `http://localhost:3004/newgroup/AddUser?groupId=${groupId}&userId=${userId}`,
//       Addusertogroup,
//       {
//         headers: { Authorization: token },
//       }
//     );
//     console.log(response, "response in getting the selected users into group");
//   } catch (err) {}
// };

// const getGroups = async (e) => {
//   try {
//     const response = await axios.get("http://localhost:3004/group/getgroups", {
//       headers: { Authorization: token },
//     });
//     console.log(response, "getgroupss");
//     const res1 = response.data.getgroups;
//     console.log("res1,", res1);
//     // res1.forEach((group) => {
//     //   displaygroups(group);
//     // });
//     displaygroups(res1.GroupName);
//   } catch (err) {
//     console.log(err, "err in  getting group");
//   }
// };
// function displaygroups(group) {
//   const usersselected1 = document.getElementById("users2");
//   const li = document.createElement("li");
//   li.appendChild(document.createTextNode(group.GroupName));
//   usersselected1.appendChild(li);
// }

// document.addEventListener("DOMContentLoaded", getGroups);
