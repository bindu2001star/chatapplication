const jwt = require("jsonwebtoken");
const User = require("../model/users");
const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("tokennnnnnnn",token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token not provided" });
    } else {
      const secretkey = process.env.JSW_KEY;
      const decode = jwt.verify(token, secretkey);
      console.log("decoding the token", decode);
      const userId = decode.userId;
      const user = await User.findByPk(userId);
      //console.log("usserrrrrrrrr",user);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }
      req.user = {
        id: user.id,
        name: user.name,
      };
      next();
    }
  } catch (err) {
    console.log("Error occurred while authenticating user:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = {
  authentication: authentication,
};
