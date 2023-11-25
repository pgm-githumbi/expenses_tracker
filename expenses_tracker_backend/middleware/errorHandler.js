const debug = require("debug");
const Namespace = require("../namespaces");

const errorHandlerMiddlewareNamespace = new Namespace(
  "errorHandlerMiddleware",
  new Namespace("app")
);

const errorHandler = (err, req, res, next) => {
  let statusCode = null;
  if (!res.statusCode || res.statusCode === 200) statusCode = 500;
  else statusCode = res.statusCode;

  res.status(statusCode);
  logger = debug(errorHandlerMiddlewareNamespace.getName());
  logger("in error handler");
  logger("req.statusCode: " + statusCode);
  logger("error.message: " + err.message);
  logger("stackTrace: " + err.stack);

  switch (statusCode) {
    case 400:
      res.json({ message: err.message, stackTrace: err.stack });
      break;
    case 404:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 500:
      res.json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      res.json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
  }
};

module.exports = errorHandler;
