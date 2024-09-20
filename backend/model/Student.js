const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    records: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", schema);
