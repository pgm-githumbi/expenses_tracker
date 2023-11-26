const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Response = require("../controllers/response");
const Namespace = require("../namespaces");

const validateToken = asyncHandler(async (req, res, next) => {
  const namespace = new Namespace("app:jwtTokenMiddleware");
  const response = new Response(res);

  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    namespace.logErr(
      "Access made without authorization header or doesn't start with Bearer"
    );
    response.forbiddenError("Authorization required for this request");
  }

  token = authHeader.split(" ")[1];
  if (!token) {
    namespace.logErr("No authorization token in request");
    response.forbiddenError("No authorization token in request");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      namespace.logErr("Token authorisation failed");
      response.unauthorizedError("Your'e not authorised");
    }

    namespace.log("User authorised to access resource");
    req.user = decoded.user;
    next();
  });
});

module.exports = validateToken;
