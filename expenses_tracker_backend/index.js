const dotenv = require("dotenv").config();
const express = require("express");
const connectDb = require("./config/dbConnection");
const debug = require("debug")("app:index");

connectDb();

app = express();

app.use(express.json());
app.use("/api/expenses", require("./routes/expensesRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(require("./middleware/errorHandler"));

PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  debug(`listening on port: ${PORT}`);
});
