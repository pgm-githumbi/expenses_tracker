const asyncHandler = require("express-async-handler");
const Expense = require("../models/expensesModel");
const Joi = require("joi");
const Namespace = require("../namespaces");
const validateExpense = require("../validators/expenseValidators");

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
  const expenses = await Expense.find();
  res.status(200).send(expenses);
});

//@desc get an expense
//@route GET /api/expense/:id
//@access public
const getExpense = asyncHandler(async (req, res) => {
  const log = getExpenseNamespace.log(`getting expense id : ${req.params.id}`);

  doExpenseExists(req, res);

  log("get Expense successful");
  res.status(200).send(expense);
});

//@desc post an new expense
//@route POST /api/expenses
//@access public
const createExpense = asyncHandler(async (req, res) => {
  const logger = postExpenseNamespace.log(`create expense body: `, req.body);

  validateExpense(req.body, postExpenseNamespace);

  const expense = await Expense.create({ ...req.body });
  logger.log("expense created successfully");
  res.status(201).send(expense);
});

//@desc update an expense
//@route PUT /api/expenses/:id
//@access public
const updateExpense = asyncHandler(async (req, res) => {
  const logger = updateExpenseNamespace.log(
    `update expense: ${req.params.id} with: ${req.body}`
  );

  doExpenseExists(req, res, updateExpenseNamespace);
  validateExpense(req.body, updateExpenseNamespace);

  const expense = await Expense.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });

  logger.log("expense update success");
  res.status(200).send(expense);
});

//@desc delete an expense
//@route DELETE /api/expenses/:id
//@access public
const deleteExpense = asyncHandler(async (req, res) => {
  const logger = deleteExpenseNamespace.log(`delete expense: ${req.params.id}`);

  doExpenseExists(req, res);

  const expense = Expense.findByIdAndRemove(req.params.id);

  log.log("expense removed successfully");

  res.status(200).send(expense);
});

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};

function doExpenseExists(req, res, namespace = null) {
  const logger = namespace || new Namespace("app:doesExpenseExists");
  logger.log(`does expense with id ${req.params.id} exist?`);
  const expense0 = Expense.findById(req.params.id);
  if (!expense0) {
    res.status(404);
    logger.log("expense not found");
    throw new Error(`Expense not found`);
  }
  logger.log("it exists");
}
