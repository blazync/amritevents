const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        Error: "Sorry! You are not authorized to perform this action.",
      });
    }
    const users = await Users.find();
    return res.status(200).json({
      success: true,
      users: users,
      message: "Users Fetched Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userPostRegister = async (req, res) => {
  const {
    username,
    name,
    email,
    mobile,
    gender,
    profile_img,
    password,
  } = req.body;

  try {
    // Validate required fields
    if (!username || !name || !email || !mobile || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate email format using validator
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate phone number format using validator (assuming mobile is a 10-digit number)
    if (!validator.isMobilePhone(mobile, "any", { strictMode: false })) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number format" });
    }

    // Check if user already exists with the same username, email, or mobile
    const existingUser = await Users.findOne({
      $or: [{ username: username }, { email: email }, { mobile: mobile }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new Users({
      username,
      name,
      email,
      mobile,
      profile_img,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateAccessToken = (id, name, is_admin) => {
  const token_value = {
    userId: id,
    name: name,
    is_admin: is_admin,
  };
  return jwt.sign(token_value, "secretkey");
};

const userPostLogin = async (req, res) => {
  let usernameOrEmailOrMobile;
  const { username, email, mobile, password } = req.body;

  // Determine the value of usernameOrEmailOrMobile based on which field is provided
  if (username) {
    usernameOrEmailOrMobile = username;
  } else if (email) {
    usernameOrEmailOrMobile = email;
  } else if (mobile) {
    usernameOrEmailOrMobile = mobile;
  } else {
    return res
      .status(400)
      .json({ error: "Please provide username, email, or mobile" });
  }

  try {
    // Find the user by username, email, or mobile
    const existingUser = await Users.findOne({
      $or: [
        { username: usernameOrEmailOrMobile },
        { email: usernameOrEmailOrMobile },
        { mobile: usernameOrEmailOrMobile },
      ],
    });

    if (!existingUser) {
      return res
        .status(401)
        .json({ error: "Seems you are not registered or entered wrong details" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "You have entered wrong password!" });
    } else {
      return res.status(201).json({
        success: "Successful Login",
        token: generateAccessToken(
          existingUser._id,
          existingUser.name,
          existingUser.is_admin
        ),
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  userPostRegister,
  userPostLogin,
};
