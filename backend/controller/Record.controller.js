const Record = require("../model/Record");
const Student = require("../model/Student");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const Admin = require("../model/Admin");

dotenv.config({
  path: path.resolve("./env/.env"),
});

const postRecord = async (req, res) => {
  const { regNo } = req.query;
  const {
    attention = 0,
    noAttentionSleepy = 0,
    noAttentionDistracted = 0,
  } = req.body;
  console.log(attention, noAttentionSleepy, noAttentionDistracted);
  if (!regNo)
    return res
      .status(401)
      .json({ success: false, message: "registeration number required" });
  const student = await Student.findOne({ regNo: regNo });
  if (!student)
    return res
      .status(404)
      .json({ success: false, message: "student not found" });
  const record = await Record.create({
    studentId: student._id,
    attentive: attention,
    notAttentiveDistracted: noAttentionDistracted,
    notAttentiveSleeping: noAttentionSleepy,
  });
  student.records.push(record._id);
  await student.save();
  return res
    .status(200)
    .json({ success: true, message: "user created", record });
};

const getRecords = async (req, res) => {
  try {
    const { token, studentId } = req.body;
    if (!token || !studentId)
      return res
        .status(401)
        .json({ success: false, message: "data not valid" });
    const { id } = jwt.decode(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(id);
    if (!admin)
      return res.status(401).json({ success: false, message: "unauthorized" });
    const records = await Record.find({ studentId: studentId }).populate(
      "studentId",
      "name regNo"
    );
    return res
      .status(200)
      .json({ success: true, message: "records found", records });
  } catch (err) {
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports = {
  postRecord,
  getRecords,
};
