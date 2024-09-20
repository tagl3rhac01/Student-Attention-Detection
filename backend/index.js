const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { connection } = require("./connection");
const bodyParser = require("body-parser");
const adminRouter = require("./routes/Admin.routes");
const recordRouter = require("./routes/Record.routes");
const studentRouter = require("./routes/Student.routes");
const cors = require("cors");

dotenv.config({
  path: path.resolve("./env/.env"),
});

const PORT = process.env.PORT || 8080;

connection()
  .then(() => console.log("connected"))
  .catch((err) => process.exit(1));

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use(cors({ origin: "*" }));

app.use("/api/admin", adminRouter);
app.use("/api/record", recordRouter);
app.use("/api/student", studentRouter);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
