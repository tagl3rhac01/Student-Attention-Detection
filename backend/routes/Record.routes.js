const express = require("express");
const { postRecord, getRecords } = require("../controller/Record.controller");

const router = express.Router();

router.post("/add", postRecord);

router.post("/get", getRecords);

module.exports = router;
