const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Globals = require("../config/config");

const uploadDir = Globals.imagePath;

const storage = multer.diskStorage

const upload = multer({ storage: storage });
module.exports = upload;
