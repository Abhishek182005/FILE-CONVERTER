# UniConvert — Universal File Converter

A full-stack MERN web application that converts files between multiple formats directly in your browser. No sign-up, no ads, no file-size gimmicks.

---

## Features

### Drag-and-Drop File Upload

Drop any supported file directly onto the converter card or click to browse from your device. The UI instantly detects the file type and shows only the relevant output format options — no manual selection of input type needed.

### Document Conversion

| Input | Output | Details |
|---|---|---|
| DOCX / DOC | PDF | Converts Microsoft Word documents to PDF while preserving layout and formatting |
| TXT | PDF | Wraps plain text in a clean, paginated PDF using PDFKit |
| TXT | DOCX | Packages plain text into a proper Word document (.docx) using the `docx` library |

### Spreadsheet Conversion

| Input | Output | Details |
|---|---|---|
| XLSX / XLS | CSV | Reads all sheets from an Excel workbook and exports the first sheet as a comma-separated values file |
| CSV | XLSX | Parses a CSV file and creates a properly formatted Excel workbook |

### Image Conversion

The image converter is powered by Sharp — one of the fastest image processing libraries for Node.js. Any of the following formats can be converted to any other:

`JPG` `PNG` `WebP` `BMP` `TIFF` `GIF` `AVIF`

Images can also be converted to **PDF** by embedding them in a PDFKit-generated document sized to the image dimensions.

### Real-time Progress Indicator

A live progress bar tracks both the upload phase (0–60%) and the download phase (60–100%), so you always know how far along your conversion is.

### Auto-download on Completion

Once conversion is done the converted file is automatically downloaded to your device — no extra clicks needed. The original filename is preserved with the new extension.

### Automatic File Cleanup

Uploaded files and converted outputs are automatically deleted from the server **2 minutes** after conversion. Nothing is stored permanently.

### Responsive Design

The entire UI is fully responsive — works on mobile phones, tablets, and desktops. The navbar collapses into a hamburger menu on small screens.

### Multi-page Navigation

- **Home** — drag-and-drop converter with a feature overview
- **Formats** — full table of every supported input → output combination
- **About** — how it works, privacy policy, and full tech stack

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP client | Axios |
| Backend | Node.js, Express 5 |
| File uploads | Multer (50 MB limit) |
| Word → PDF | docx-pdf |
| TXT → DOCX | docx |
| PDF generation | PDFKit |
| Image conversion | Sharp |
| Spreadsheet conversion | XLSX |

---

## Project Structure

```
WORD-TO-PDF/
├── Backend/
│   ├── index.js                  # Express server entry point
│   ├── package.json
│   ├── .env                      # PORT variable
│   ├── controller/
│   │   └── ConvertController.js  # All conversion logic
│   ├── route/
│   │   └── ConvertRoute.js       # API routes
│   ├── uploads/                  # Temp uploaded files
│   └── files/                    # Temp converted files
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx               # Route definitions
        ├── main.jsx              # App entry point
        ├── components/
        │   ├── navbar.jsx        # Responsive navbar with hamburger menu
        │   └── FileConverter.jsx # Drag-and-drop converter card
        └── pages/
            ├── Home.jsx          # Hero + converter + feature strips
            ├── Formats.jsx       # Full supported formats table
            └── About.jsx         # How it works + tech stack
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/Abhishek182005/WORD-TO-PDF.git
cd WORD-TO-PDF
```

### 2. Start the Backend

```bash
cd Backend
npm install
npm start
```

The API server starts at `http://localhost:3000`.

### 3. Start the Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/convert/doc-to-pdf` | DOCX / DOC → PDF |
| POST | `/convert/txt-to-pdf` | TXT → PDF |
| POST | `/convert/txt-to-docx` | TXT → DOCX |
| POST | `/convert/excel-to-csv` | XLSX / XLS → CSV |
| POST | `/convert/csv-to-excel` | CSV → XLSX |
| POST | `/convert/image` | Image → Image (body: `outputFormat`) |
| POST | `/convert/image-to-pdf` | Image → PDF |

All endpoints accept `multipart/form-data` with a `file` field. Maximum file size is **50 MB**.

---

## Environment Variables

Create a `.env` file inside `/Backend`:

```env
PORT=3000
```

---

## Privacy

Uploaded files are stored temporarily on the server and automatically deleted **2 minutes** after conversion. No file content is stored, logged, or shared with any third party.

---

## License

MIT