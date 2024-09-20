const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const Student = require("../model/Student");

dotenv.config({
  path: path.resolve("./env/.env"),
});

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(401).json({
        success: false,
        message: "all details needed",
      });
    let admin = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (admin)
      return res
        .status(401)
        .json({ success: false, message: "user alredy exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    admin = await Admin.create({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY);
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      token: token,
    });
  } catch (err) {
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(401)
        .json({ sucess: false, message: "give all details" });
    let admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).select("+password");
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    const confirm = await bcrypt.compare(password, admin.password);
    if (!confirm)
      return res.status(401).json({
        success: false,
        message: "either email or password incorrect",
      });
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY);
    return res
      .status(200)
      .json({ success: true, message: "logged in", token: token });
  } catch (err) {
    console.log(err);
    return res.status(501).json({
      success: false,
      message: "internal server error",
    });
  }
};

const searchController = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search)
      return res.status(404).json({
        success: false,
        message: "kindly give name or registeration number",
      });
    let student = await Student.find({ name: search });
    if (student.length > 0)
      return res
        .status(200)
        .json({ success: true, message: "student found", students: student });
    student = await Student.find({ regNo: search });
    return res
      .status(200)
      .json({ success: true, message: "student found", students: student });
  } catch (err) {
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

const addStudent = async (req, res) => {
  try {
    const { token, studentId } = req.body;
    if (!token || !studentId)
      return res
        .status(404)
        .json({ success: false, message: "user not authenticated" });
    const { id } = jwt.decode(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(id);
    const exists = admin.students.find(
      (val) => val.toString() === studentId.toString()
    );
    if (exists)
      return res
        .status(200)
        .json({ success: true, message: "user already added" });
    const student = await Student.findById(studentId);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "student does not exists" });
    admin.students.push(studentId);
    await admin.save();
    return res.status(201).json({ success: true, message: "student added" });
  } catch (err) {
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

const getStudents = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "user not authenticated" });
    const { id } = jwt.decode(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(id);
    const students = await Student.find({ regNo: admin.students });
    return res
      .status(200)
      .json({ success: true, message: "students found", students });
  } catch (err) {
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

const getAdminDetails = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Kindly enter all details" });

    const { id } = jwt.decode(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(id).populate("students", "name regNo");
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "admin not found" });
    return res
      .status(200)
      .json({ success: true, message: "Admin found", user: admin });
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  searchController,
  addStudent,
  getStudents,
  getAdminDetails,
};
