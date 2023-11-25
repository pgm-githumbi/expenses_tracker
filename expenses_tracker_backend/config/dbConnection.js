const mongoose = require("mongoose");
const debug = require("debug");

const Namespace = require("../namespaces");

const debugNamespace = new Namespace("mongodb", new Namespace("app"));
const errorNamespace = new Namespace("error", debugNamespace);

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    log = debug(debugNamespace.getName());
    log(
      "connected to database",
      connect.connection.host,
      connect.connection.name,
      connect.connection.port
    );
  } catch (err) {
    log = debug(errorNamespace.getName());
    log("error connecting to database: ", err.message);
    log("Error connecting to database: ", err.stack);
    process.exit();
  }
};

module.exports = connectDb;
