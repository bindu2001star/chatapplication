const User = require("../model/users");
exports.getuserdetails = async (id, message) => {
  console.log(id, message);
  const user = await User.findByPk(id);
  return {
    userId: user.id,
    userName: user.name,
    message: message,
  };
};
