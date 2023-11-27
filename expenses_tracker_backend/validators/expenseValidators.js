const Joi = require("joi");
const Namespace = require("../namespaces");
const Response = require("../response");

const expense_schema = Joi.object({
  product: Joi.string().alphanum().min(2).max(512).required(),
  cost_per_unit: Joi.number().positive(),
  units_count: Joi.number().positive().required(),
  total_cost: Joi.number().positive(),
}); //.xor("cost_per_unit", "total_amount");

const isExpenseValid = async ({ expense, response, namespace }) => {
  const logSpace = new Namespace(
    "expenseValidator",
    namespace || new Namespace("app")
  );
  logSpace.log(`validating expense: `, expense);

  try {
    await expense_schema.validateAsync(expense);
  } catch (err) {
    logSpace.logErr("invalid expense: " + err.msg);
    response.validationErr(err.msg);
  }

  logSpace.log("expense validated");
  return expense;
};
module.exports = isExpenseValid;
