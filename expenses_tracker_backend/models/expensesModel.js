const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema({
  product: { type: String, required: [true, "please add the product name"] },
  units_count: { type: Number },
  cost_per_unit: { type: Number },
  total_cost: {
    type: Number,
    validate: {
      validator: function (value) {
        if (this.units_count && this.cost_per_unit) {
          if (value) {
            expected = this.units_count * this.cost_per_unit;
            if (value !== expected) return false;
          }
        }
        return true;
      },
      message: "total_cost must be units_count * cost_per_unit",
    },
  },
  datetime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", expensesSchema);
