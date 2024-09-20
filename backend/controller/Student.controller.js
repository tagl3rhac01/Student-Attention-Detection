const Student = require("../model/Student");

const createStudent = async (req, res) => {
  try {
    const { name, regNo } = req.body;
    if (!name || !regNo)
      return res
        .status(404)
        .json({ success: false, message: "all details needed" });
    let student = await Student.findOne({ regNo: regNo });
    if (student)
      return res.status(401).json({
        success: false,
        message: "student with given registeration number already exists",
      });
    student = await Student.create({
      name: name,
      regNo: regNo,
    });
    return res.status(201).json({ success: true, message: "student created" });
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports = {
  createStudent,
};
