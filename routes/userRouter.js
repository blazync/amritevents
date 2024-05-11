const express = require("express");
const router = express.Router();

const {
  getUsers,
  userPostLogin,
  userPostRegister,
} = require("../controllers/userController.js");
const authenticate = require("../middleware/auth.js");

/** GET METHODS */
router.get("/users", authenticate, getUsers);

/** POST METHODS */
router.post("/user/register", userPostRegister);
router.post("/user/login", userPostLogin);

module.exports = router;
