const path = require("path");
const fs = require("fs");
const doctopdfconverter = require("docx-pdf");
const sharp = require("sharp");
const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");
const { Document, Packer, Paragraph, TextRun } = require("docx");

// Ensure output directories exist
const filesDir = path.join(__dirname, "../files");
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Clean up temp files after delay
const cleanupFile = (filePath, delay = 120000) => {
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.error("Cleanup error:", e.message);
    }
  }, delay);
};

// Safe unique output path (avoids collisions)
const getOutputPath = (originalName, ext) => {
  const baseName = path.parse(originalName).name.replace(/[^a-z0-9_\-]/gi, "_");
  const unique = `${baseName}_${Date.now()}.${ext}`;
  return path.join(filesDir, unique);
};

// ─── DOCX / DOC → PDF ────────────────────────────────────────────────────────
exports.convertDocToPdf = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const outputPath = getOutputPath(req.file.originalname, "pdf");

    doctopdfconverter(req.file.path, outputPath, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error converting document to PDF." });
      }
      res.download(
        outputPath,
        path.parse(req.file.originalname).name + ".pdf",
        (err) => {
          if (err) console.error(err);
          cleanupFile(req.file.path);
          cleanupFile(outputPath);
        },
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ─── Image → Image format (sharp) ────────────────────────────────────────────
exports.convertImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const { outputFormat } = req.body;
    if (!outputFormat)
      return res.status(400).json({ error: "Output format is required." });

    const ext = outputFormat.toLowerCase();
    const outputPath = getOutputPath(req.file.originalname, ext);

    let instance = sharp(req.file.path);
    if (ext === "jpg" || ext === "jpeg")
      instance = instance.jpeg({ quality: 90 });
    else if (ext === "png") instance = instance.png({ compressionLevel: 6 });
    else if (ext === "webp") instance = instance.webp({ quality: 90 });
    else if (ext === "avif") instance = instance.avif({ quality: 80 });
    else if (ext === "tiff") instance = instance.tiff({ quality: 90 });
    else if (ext === "gif") instance = instance.gif();
    else if (ext === "bmp") instance = instance.bmp();
    else return res.status(400).json({ error: "Unsupported image format." });

    await instance.toFile(outputPath);

    res.download(
      outputPath,
      path.parse(req.file.originalname).name + "." + ext,
      (err) => {
        if (err) console.error(err);
        cleanupFile(req.file.path);
        cleanupFile(outputPath);
      },
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error converting image: " + err.message });
  }
};

// ─── Image → PDF ──────────────────────────────────────────────────────────────
exports.convertImageToPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const outputPath = getOutputPath(req.file.originalname, "pdf");
    const metadata = await sharp(req.file.path).metadata();
    const imgWidth = metadata.width || 595;
    const imgHeight = metadata.height || 842;

    // Convert to PNG buffer (pdfkit handles PNG/JPEG)
    const pngBuffer = await sharp(req.file.path).png().toBuffer();

    const doc = new PDFDocument({ size: [imgWidth, imgHeight], margin: 0 });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    doc.image(pngBuffer, 0, 0, { width: imgWidth, height: imgHeight });
    doc.end();

    writeStream.on("finish", () => {
      res.download(
        outputPath,
        path.parse(req.file.originalname).name + ".pdf",
        (err) => {
          if (err) console.error(err);
          cleanupFile(req.file.path);
          cleanupFile(outputPath);
        },
      );
    });

    writeStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Error creating PDF." });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error converting image to PDF: " + err.message });
  }
};

// ─── TXT → PDF ────────────────────────────────────────────────────────────────
exports.convertTxtToPdf = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const outputPath = getOutputPath(req.file.originalname, "pdf");
    const content = fs.readFileSync(req.file.path, "utf-8");

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    doc
      .font("Courier")
      .fontSize(12)
      .text(content, { lineGap: 4, lineBreak: true });
    doc.end();

    writeStream.on("finish", () => {
      res.download(
        outputPath,
        path.parse(req.file.originalname).name + ".pdf",
        (err) => {
          if (err) console.error(err);
          cleanupFile(req.file.path);
          cleanupFile(outputPath);
        },
      );
    });

    writeStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Error creating PDF." });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error converting TXT to PDF: " + err.message });
  }
};

// ─── TXT → DOCX ──────────────────────────────────────────────────────────────
exports.convertTxtToDocx = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const outputPath = getOutputPath(req.file.originalname, "docx");
    const content = fs.readFileSync(req.file.path, "utf-8");

    const lines = content.split(/\r?\n/);
    const paragraphs = lines.map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, font: "Calibri", size: 24 })],
          spacing: { after: 160 },
        }),
    );

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);

    res.download(
      outputPath,
      path.parse(req.file.originalname).name + ".docx",
      (err) => {
        if (err) console.error(err);
        cleanupFile(req.file.path);
        cleanupFile(outputPath);
      },
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error converting TXT to DOCX: " + err.message });
  }
};

// ─── XLSX / XLS → CSV ─────────────────────────────────────────────────────────
exports.convertExcelToCsv = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const outputPath = getOutputPath(req.file.originalname, "csv");
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    fs.writeFileSync(outputPath, csv);

    res.download(
      outputPath,
      path.parse(req.file.originalname).name + ".csv",
      (err) => {
        if (err) console.error(err);
        cleanupFile(req.file.path);
        cleanupFile(outputPath);
      },
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error converting Excel to CSV: " + err.message });
  }
};

// ─── CSV → XLSX ───────────────────────────────────────────────────────────────
exports.convertCsvToExcel = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const outputPath = getOutputPath(req.file.originalname, "xlsx");
    const content = fs.readFileSync(req.file.path, "utf-8");
    const workbook = XLSX.read(content, { type: "string" });

    XLSX.writeFile(workbook, outputPath);

    res.download(
      outputPath,
      path.parse(req.file.originalname).name + ".xlsx",
      (err) => {
        if (err) console.error(err);
        cleanupFile(req.file.path);
        cleanupFile(outputPath);
      },
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error converting CSV to XLSX: " + err.message });
  }
};
