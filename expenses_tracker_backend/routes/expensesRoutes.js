const express = require("express");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpense,
} = require("../controllers/expensesController");

const router = express.Router();

router.use(require("../middleware/jwtTokenHandler"));
router.route("/").get(getExpenses).post(createExpense);

router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);

module.exports = router;
