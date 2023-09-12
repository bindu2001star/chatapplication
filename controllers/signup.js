const User = require("../model/users");
const bcrypt = require("bcrypt");
const saltrounds = 10;
const signup = async (req, res, next) => {
  try {

    let { name, email, phoneNumber, password } = req.body;
    let hashedpassword = await bcrypt.hash(password, saltrounds);
    let oldUser = await User.findOne({ where: { email } });
    if (!oldUser) {
      let response = await User.create({
        name,
        email,
        phoneNumber,
        password: hashedpassword,
      });
      res.status(201).json({ success: true, response: response });
    } else {
      res.status(400).json({ success: false, message: "User already exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports={
    signup:signup
}
