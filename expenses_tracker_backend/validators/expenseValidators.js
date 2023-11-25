const Joi = require("joi");
const Namespace = require("../namespaces");

const expense_schema = Joi.object({
  product: Joi.string().alphanum().min(2).max(512).required(),
  cost_per_unit: Joi.number().positive(),
  units_count: Joi.number().positive().required(),
  total_amount: Joi.number().positive(),
}); //.xor("cost_per_unit", "total_amount");

const isExpenseValid = (expense, namespace = null) => {
  const logSpace = new Namespace(
    "expenseValidator",
    namespace || new Namespace("app")
  );

  logSpace.log(`validating expense: `, expense);
  const { err, res } = Joi.validate(expense, expense_schema);

  if (err) {
    logSpace.logErr(`Expense validation failed`, err.message);
    throw err;
  }

  logSpace.log("expense validated");
  return expense;
};
module.exports = isExpenseValid;
