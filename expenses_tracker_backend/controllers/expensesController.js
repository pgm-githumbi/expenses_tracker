const asyncHandler = require("express-async-handler");
const Expense = require("../models/expensesModel");
const Joi = require("joi");
const Namespace = require("../namespaces");
const validateExpense = require("../validators/expenseValidators");
const Response = require("../response");

const debug = require("debug");

//@Namespaces
const moduleNamespace = new Namespace(
  require("path").basename(__filename, ".js"),
  new Namespace("app")
);
const apiNamespace = new Namespace("api", moduleNamespace);
const getExpensesNamespace = new Namespace("getExpenses", apiNamespace);
const getExpenseNamespace = new Namespace("getExpense", apiNamespace);
const postExpenseNamespace = new Namespace("createExpense", apiNamespace);
const updateExpenseNamespace = new Namespace("updateExpense", apiNamespace);
const deleteExpenseNamespace = new Namespace("deleteExpense", apiNamespace);

//@desc get all expenses
//@route GET /api/expenses
//@access public
const getExpenses = asyncHandler(async (req, res) => {
  const log = debug(getExpensesNamespace.getName());
  log("getting all expenses");
  const expenses = await Expense.find({ user_id: req.user._id });

  res.status(200).send(expenses);
});

//@desc get an expense
//@route GET /api/expense/:id
//@access private
const getExpense = asyncHandler(async (req, res) => {
  const namespace = getExpenseNamespace.log(
    `getting expense id : ${req.params.id}`
  );
  const response = new Response(res);

  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    namespace.logErr("Cound not find expense with id " + req.params.id);
    response.notFoundError("Cound not find expense with id " + req.params.id);
  }

  if (req.user._id !== expense.user_id._id.toString()) {
    namespace.logErr("Not authorised to access this resource");
    response.unauthorizedError("Not authorised to access this resource");
  }

  namespace.log("got expense successfully");
  response.OK_response(expense);
});

//@desc post an new expense
//@route POST /api/expenses
//@access private
const createExpense = asyncHandler(async (req, res) => {
  const namespace = postExpenseNamespace.log(`create expense body: `, req.body);
  const response = new Response(res);

  await validateExpense({
    expense: req.body,
    namespace: postExpenseNamespace,
    response,
  });

  const expenseArgs = { ...req.body, user_id: req.user._id };
  namespace.log(expenseArgs);
  const expense = await Expense.create(expenseArgs);
  if (!expense) {
    namespace.logErr("Failed to create expense");
    response.internalServerError("Could not post expense");
  }

  namespace.log("expense created successfully");
  response.OK_response(expense);
});

//@desc update an expense
//@route PUT /api/expenses/:id
//@access private
const updateExpense = asyncHandler(async (req, res) => {
  const namespace = updateExpenseNamespace;
  namespace.log(`update expense: ${req.params.id} with: `, req.body);
  const response = new Response(res);

  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    namespace.logErr("Expense not found");
    response.notFoundError("Expense with id " + req.params.id + " not found");
  }

  if (req.user._id !== expense.user_id._id.toString()) {
    namespace.log("Attempting to update another user's resources");
    response.forbiddenError("The action you're attempting is forbidden");
  }

  // Will throw if invalid
  await validateExpense({
    expense: req.body,
    response,
    namespace: updateExpenseNamespace,
  });

  await Expense.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });

  const updatedExpense = await Expense.findById(req.params.id);

  if (!updatedExpense) {
    if (!req.body) {
      namespace.logErr("Failed to update expense");
      response.internalServerError("Failed to update expense");
    }
  }

  namespace.log("Expense update success");
  response.OK_response(updatedExpense);
});

//@desc delete an expense
//@route DELETE /api/expenses/:id
//@access private
const deleteExpense = asyncHandler(async (req, res) => {
  const namespace = deleteExpenseNamespace.log(
    `delete expense: ${req.params.id}`
  );
  const response = new Response(res);

  const expense = await Expense.findOneAndDelete({ _id: req.params.id });

  if (!expense) {
    namespace.logErr("Expense not found");
    response.notFoundError("Expense not found");
  }

  if (req.user._id !== expense.user_id._id.toString()) {
    namespace.logErr("Attempting to delete another user's resources");
    response.forbiddenError("Attempting to delete another user's resources");
  }

  namespace.log("Expense: " + JSON.stringify(expense));
  namespace.log("Expense successfully deleted:");
  response.OK_response(expense);
});

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};

async function doExpenseExists({ req, namespace, response }) {
  const logger = namespace || new Namespace("app:doesExpenseExists");
  logger.log(`does expense with id ${req.params.id} exist?`);

  const expense0 = await Expense.findById(req.params.id);
  if (!expense0) {
    logger.log("expense not found");
    response.notFoundError("Expense not found");
  }
  logger.log("it exists");
  return expense0;
}
