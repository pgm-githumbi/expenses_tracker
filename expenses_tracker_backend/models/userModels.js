const mongoose = require("mongoose");
const Joi = require("joi");
const Namespace = require("../namespaces");

const schemaNamespace = new Namespace("UserSchema", new Namespace("app"));
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      maxlength: 255,
      validate: {
        validator: async function (value) {
          try {
            await Joi.string().alphanum().exist().validateAsync(value);
            return true;
          } catch (err) {
            schemaNamespace.logErr(err.message);
            schemaNamespace.logErr("Invalid username");
            return false;
          }
        },
        message: "Invalid Username",
      },
      required: [true, "Please add the username"],
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      unique: [true, "The email address is already taken"],
      validate: {
        validator: async function (value) {
          try {
            await Joi.string().email().validateAsync(value);
            return true;
          } catch (err) {
            schemaNamespace.logErr("invalid email: " + value);
            schemaNamespace.logErr(err.message);
          }
          return false;
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 1048,
      required: [true, "Please add the password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
