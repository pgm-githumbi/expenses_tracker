const Namespace = require("../namespaces");
const asyncHandler = require("express-async-handler");
const User = require("./user");
const Responder = require("./response");

const registerNamespace = new Namespace("register", new Namespace("app"));
const loginNamespace = new Namespace("login", new Namespace("app"));
const currentUserNamespace = new Namespace("currentUser", new Namespace("app"));

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  registerNamespace.log("registering a user: ", req.body);
  const { username, email, password } = req.body;
  const user = new User({
    username,
    email,
    password,
    responder: new Responder(res),
    namespace: registerNamespace,
  });

  await user.register();
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  loginNamespace.log("logging in a user: ", req.body);
  const { username, password, email } = req.body;
  const user = new User({
    username,
    password,
    responder: new Responder(res),
    email,
  });

  await user.loginUser();
});

//@desc Get the current user
//@route GET /api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  currentUserNamespace.log("getting the current user: ", req.body);
  res.status(200).json({ message: "register user" });
});

module.exports = { registerUser, loginUser, currentUser };
