const express = require("express");
const Namespace = require("../namespaces");

const router = express.Router();

const registerNamespace = new Namespace("register", new Namespace("app"));
const loginNamespace = new Namespace("login", new Namespace("app"));

router.post("/register", (req, res) => {
  registerNamespace.log("registering a user: " + req.body);
  res.status(200).json({ message: "register user" });
});

router.post("/login", (req, res) => {
  loginNamespace.log("logging in a user: ", req.body);
  res.status(200).json({ message: "login user" });
});

router.get("/current", (req, res) => {
  const namespace = new Namespace("app").createNewNamespace("current");
  namespace.log("in current user");
  res.json({ message: "current user" });
});

module.exports = router;
