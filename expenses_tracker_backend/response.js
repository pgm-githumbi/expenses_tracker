class Response {
  constructor(res) {
    this.res = res;
  }
  OK_response(args) {
    this.res.status(200).json(args);
  }

  createdResponse(args) {
    this.res.status(200).json(args);
  }

  validationErr(errMsg) {
    this.res.status(400);
    throw new Error(errMsg);
  }

  notFoundError(errMsg) {
    this.res.status(404);
    throw new Error(errMsg);
  }

  badRequestError(errMsg) {
    this.res.status(400);
    throw new Error(errMsg);
  }

  unauthorizedError(errMsg) {
    this.res.status(401);
    throw new Error(errMsg);
  }

  forbiddenError(errMsg) {
    this.res.status(403);
    throw new Error(errMsg);
  }

  internalServerError(errMsg) {
    this.res.status(500);
    throw new Error(errMsg);
  }
}
module.exports = Response;
