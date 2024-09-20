const express = require("express");
const {
  registerController,
  loginController,
  searchController,
  addStudent,
  getStudents,
  getAdminDetails,
} = require("../controller/Admin.controller");

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/search", searchController);

router.put("/add/student", addStudent);

router.get("/students", getStudents);

router.post("/me", getAdminDetails);

module.exports = router;
