const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve("./env/.env"),
});

const connection = async () => {
  try {
    console.log(process.env.CONNECTION_URI);
    const status = await mongoose.connect(process.env.CONNECTION_URI || "");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  connection,
};

