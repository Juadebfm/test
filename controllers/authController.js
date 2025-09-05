const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user with this emaill already exists",
      });
    }
    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "user created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Encounter registring users, please try again later",
      error: error.message,
    });
  }
};
// login
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User or Password" });
    }
    // check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return;
      res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    //create token
    const token = createToken(user._id);

    // send response
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Login In",
      error: error.message,
    });
  }
};
//user profile
const getProfile = async (req, res) => {
  try {
    // // req.user
    // const user = await User.findById(req.user._id).select("-password");
    const user = req.user;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Getting Profile",
      error: error.message,
    });
  }
};
module.exports = { register, logIn, getProfile };
