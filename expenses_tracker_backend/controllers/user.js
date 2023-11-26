const UserModel = require("../models/userModels");
const mongoose = require("mongoose");
const Namespace = require("../namespaces");
const bcrypt = require("bcrypt");
const Responder = require("./response");
const jwt = require("jsonwebtoken");

class User {
  constructor({ username, email, password, responder, namespace } = {}) {
    this.username = username;
    this.email = email;
    this.password = password;

    this.response = responder;
    this.namespace = namespace || new Namespace("app:user").join(this.username);
  }

  setNamespace(namespace) {
    this.namespace = namespace;
  }

  setResponder(responder) {
    this.response = responder;
  }

  async register() {
    const logger = this.namespace;

    if (!this.username || !this.email || !this.password)
      this.response.validationErr("Username, email and password required");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      var user = UserModel({
        username: this.username,
        email: this.email,
        password: await this._hashedPassword(),
      });

      if (await UserModel.findOne({ email: user.email }))
        this.response.badRequestError("Email already exists");

      if (await UserModel.findOne({ username: user.username }))
        this.response.badRequestError("Username already exists");

      await user.save(session);
      logger.log("User ", user, " registered");
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      logger.log("Failed to register user");
      throw err;
    } finally {
      await session.endSession();
    }
    this.successfullyRegisteredUser(user);
  }

  async loginUser() {
    const namespace = this.namespace.join("login");

    if (!this.username || !this.password) {
      namespace.logErr("Missing username or password");
      this.response.badRequestError("Missing username or password");
    }

    const user = await UserModel.findOne({ username: this.username });
    if (!user) {
      namespace.logErr("User ", this.username, " not found");
      this.response.badRequestError("Wrong username or password");
    }

    if (!(await bcrypt.compare(this.password, user.password))) {
      namespace.logErr("Wrong password");
      this.response.badRequestError("Wrong username or password");
    }

    this.user = user;
    namespace.log("Successfully logged in");
    this.successfullyLoggedIn(user);
  }

  async _hashedPassword() {
    return await bcrypt.hash(this.password, 10);
  }

  async successfullyRegisteredUser(user) {
    const userResponse = {
      _id: user.id,
      username: user.username,
      email: user.email,
    };
    this.response.OK_response(userResponse);
  }

  async successfullyLoggedIn(user) {
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    this.response.OK_response(accessToken);
  }
}

module.exports = User;
