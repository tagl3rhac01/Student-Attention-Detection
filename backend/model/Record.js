const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    attentive: {
      type: Number,
      default: 0,
    },
    notAttentiveSleeping: {
      type: Number,
      default: 0,
    },
    notAttentiveDistracted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Record", schema);
