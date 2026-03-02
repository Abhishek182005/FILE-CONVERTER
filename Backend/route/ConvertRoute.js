const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Storage — unique filenames to avoid collisions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

// Controllers
const {
  convertDocToPdf,
  convertImage,
  convertImageToPdf,
  convertTxtToPdf,
  convertTxtToDocx,
  convertExcelToCsv,
  convertCsvToExcel,
} = require("../controller/ConvertController");

// Routes
router.post("/convert/doc-to-pdf", upload.single("file"), convertDocToPdf);
router.post("/convert/image", upload.single("file"), convertImage);
router.post("/convert/image-to-pdf", upload.single("file"), convertImageToPdf);
router.post("/convert/txt-to-pdf", upload.single("file"), convertTxtToPdf);
router.post("/convert/txt-to-docx", upload.single("file"), convertTxtToDocx);
router.post("/convert/excel-to-csv", upload.single("file"), convertExcelToCsv);
router.post("/convert/csv-to-excel", upload.single("file"), convertCsvToExcel);

module.exports = router;
