const User = require("../model/users");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
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
const generateAccessToken=(id,name)=>{
  return jwt.sign({userId:id,name:name},process.env.JSW_KEY);

}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "bad parameters" });
    }
    const usertryingtologin = await User.findAll({ where: { email: email } });
    if (usertryingtologin.length === 0) {
      return res.status(404).json({ message: "user doesnt exist" });
    } else {
      bcrypt.compare(password, usertryingtologin[0].password, (err, result) => {
        if (err) {
          throw new Error({ message: "something went wrong" });
        }
        if (result) {
          return res.status(201).json({message:"Login successfull",
          token:generateAccessToken(usertryingtologin[0].id,usertryingtologin[0].name)
        });

        }else{
          return res.status(400).json({message:"Incorrect password"})

        }
      });
    }
  } catch (err) {
    console.log('err is ', err)
    res.status(500).json({err, message:'Internal server error 500'})
  }
};
module.exports = {
  signup: signup,
  login: login,
};
