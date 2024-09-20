const express = require("express");
const { createStudent } = require("../controller/Student.controller");

const router = express.Router();

router.post("/create", createStudent);

module.exports = router;
