import { useState, useRef, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

const IMAGE_OUTPUT_OPTIONS = [
  { label: "JPG", ext: "jpg", endpoint: "/convert/image", needsBody: true },
  { label: "PNG", ext: "png", endpoint: "/convert/image", needsBody: true },
  { label: "WebP", ext: "webp", endpoint: "/convert/image", needsBody: true },
  { label: "AVIF", ext: "avif", endpoint: "/convert/image", needsBody: true },
  { label: "BMP", ext: "bmp", endpoint: "/convert/image", needsBody: true },
  { label: "TIFF", ext: "tiff", endpoint: "/convert/image", needsBody: true },
  { label: "GIF", ext: "gif", endpoint: "/convert/image", needsBody: true },
  {
    label: "PDF",
    ext: "pdf",
    endpoint: "/convert/image-to-pdf",
    needsBody: false,
  },
];

const CONVERSION_MAP = {
  doc: {
    label: "Word Document",
    tag: "DOC",
    options: [
      {
        label: "PDF",
        ext: "pdf",
        endpoint: "/convert/doc-to-pdf",
        needsBody: false,
      },
    ],
  },
  docx: {
    label: "Word Document",
    tag: "DOCX",
    options: [
      {
        label: "PDF",
        ext: "pdf",
        endpoint: "/convert/doc-to-pdf",
        needsBody: false,
      },
    ],
  },
  txt: {
    label: "Text File",
    tag: "TXT",
    options: [
      {
        label: "PDF",
        ext: "pdf",
        endpoint: "/convert/txt-to-pdf",
        needsBody: false,
      },
      {
        label: "DOCX",
        ext: "docx",
        endpoint: "/convert/txt-to-docx",
        needsBody: false,
      },
    ],
  },
  xlsx: {
    label: "Excel Spreadsheet",
    tag: "XLSX",
    options: [
      {
        label: "CSV",
        ext: "csv",
        endpoint: "/convert/excel-to-csv",
        needsBody: false,
      },
    ],
  },
  xls: {
    label: "Excel Spreadsheet",
    tag: "XLS",
    options: [
      {
        label: "CSV",
        ext: "csv",
        endpoint: "/convert/excel-to-csv",
        needsBody: false,
      },
    ],
  },
  csv: {
    label: "CSV File",
    tag: "CSV",
    options: [
      {
        label: "XLSX",
        ext: "xlsx",
        endpoint: "/convert/csv-to-excel",
        needsBody: false,
      },
    ],
  },
  jpg: {
    label: "JPEG Image",
    tag: "JPG",
    options: IMAGE_OUTPUT_OPTIONS.filter(
      (f) => f.ext !== "jpg" && f.ext !== "jpeg",
    ),
  },
  jpeg: {
    label: "JPEG Image",
    tag: "JPEG",
    options: IMAGE_OUTPUT_OPTIONS.filter(
      (f) => f.ext !== "jpg" && f.ext !== "jpeg",
    ),
  },
  png: {
    label: "PNG Image",
    tag: "PNG",
    options: IMAGE_OUTPUT_OPTIONS.filter((f) => f.ext !== "png"),
  },
  webp: {
    label: "WebP Image",
    tag: "WEBP",
    options: IMAGE_OUTPUT_OPTIONS.filter((f) => f.ext !== "webp"),
  },
  bmp: {
    label: "BMP Image",
    tag: "BMP",
    options: IMAGE_OUTPUT_OPTIONS.filter((f) => f.ext !== "bmp"),
  },
  tiff: {
    label: "TIFF Image",
    tag: "TIFF",
    options: IMAGE_OUTPUT_OPTIONS.filter((f) => f.ext !== "tiff"),
  },
  gif: {
    label: "GIF Image",
    tag: "GIF",
    options: IMAGE_OUTPUT_OPTIONS.filter((f) => f.ext !== "gif"),
  },
  avif: {
    label: "AVIF Image",
    tag: "AVIF",
    options: IMAGE_OUTPUT_OPTIONS.filter((f) => f.ext !== "avif"),
  },
};

const ACCEPT_ALL = Object.keys(CONVERSION_MAP)
  .map((e) => `.${e}`)
  .join(",");

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function FileConverter() {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    const typeInfo = CONVERSION_MAP[ext];
    if (!typeInfo) {
      setErrorMsg(`".${ext}" files are not supported.`);
      setStatus("error");
      setFile(null);
      return;
    }
    setFile(f);
    setFileInfo({ ext, typeInfo });
    setSelectedOpt(null);
    setStatus("idle");
    setErrorMsg("");
    setProgress(0);
  }, []);

  const onInputChange = (e) => handleFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  const handleConvert = async () => {
    if (!file || !selectedOpt) return;
    setStatus("converting");
    setProgress(0);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    if (selectedOpt.needsBody) formData.append("outputFormat", selectedOpt.ext);
    try {
      const response = await axios.post(
        `${API_BASE}${selectedOpt.endpoint}`,
        formData,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 60));
          },
          onDownloadProgress: (e) => {
            if (e.total)
              setProgress(60 + Math.round((e.loaded / e.total) * 40));
          },
        },
      );
      setProgress(100);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${baseName}.${selectedOpt.ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus("done");
    } catch (err) {
      console.error(err);
      let msg = "Conversion failed. Please try again.";
      if (err.response) {
        try {
          const t = await err.response.data.text();
          msg = JSON.parse(t).error || msg;
        } catch (_) {}
      }
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setFileInfo(null);
    setSelectedOpt(null);
    setStatus("idle");
    setErrorMsg("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Main card */}
      <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
        {/* Red header bar */}
        <div className='bg-red-600 px-6 py-4'>
          <h2 className='text-white font-bold text-lg'>
            Select a file to convert
          </h2>
          <p className='text-red-200 text-sm'>Maximum file size: 50 MB</p>
        </div>

        <div className='p-4 sm:p-6'>
          {!file ? (
            <>
              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none
                  ${dragging ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-400 hover:bg-red-50/50"}`}
              >
                <svg
                  className={`w-14 h-14 mb-4 transition-colors ${dragging ? "text-red-500" : "text-gray-300"}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
                <p className='text-gray-700 font-semibold text-lg mb-1'>
                  {dragging ? "Drop your file here" : "Drag and drop your file"}
                </p>
                <p className='text-gray-400 text-sm mb-5'>
                  or click to browse from your device
                </p>
                <button
                  type='button'
                  className='bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-2.5 rounded-lg transition-colors text-sm'
                >
                  Browse File
                </button>
                <p className='text-gray-400 text-xs mt-5 text-center leading-relaxed'>
                  DOCX, DOC, TXT, JPG, PNG, WebP, BMP, TIFF, GIF, AVIF, XLSX,
                  XLS, CSV
                </p>
              </div>

              {status === "error" && (
                <div className='mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between'>
                  <span>{errorMsg}</span>
                  <button
                    onClick={() => setStatus("idle")}
                    className='ml-3 text-red-400 hover:text-red-600 font-bold text-base leading-none'
                  >
                    x
                  </button>
                </div>
              )}

              <input
                ref={inputRef}
                type='file'
                accept={ACCEPT_ALL}
                onChange={onInputChange}
                className='hidden'
              />
            </>
          ) : (
            <>
              {/* File info strip */}
              <div className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5'>
                <div className='flex items-center gap-3 min-w-0'>
                  <span className='bg-red-600 text-white text-xs font-black px-2 py-1 rounded font-mono shrink-0'>
                    {fileInfo?.typeInfo?.tag}
                  </span>
                  <div className='min-w-0'>
                    <p className='text-gray-800 font-semibold truncate text-sm'>
                      {file.name}
                    </p>
                    <p className='text-gray-400 text-xs'>
                      {fileInfo?.typeInfo?.label} &middot;{" "}
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className='shrink-0 ml-4 text-gray-400 hover:text-red-600 transition text-xs font-semibold border border-gray-200 hover:border-red-300 rounded-lg px-3 py-1.5'
                >
                  Remove
                </button>
              </div>

              {/* Output format picker */}
              {status !== "done" && (
                <div className='mb-5'>
                  <p className='text-gray-400 text-xs font-bold uppercase tracking-widest mb-3'>
                    Convert to
                  </p>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                    {fileInfo?.typeInfo?.options.map((opt) => (
                      <button
                        key={opt.ext}
                        onClick={() => setSelectedOpt(opt)}
                        className={`border-2 rounded-xl py-3.5 font-bold text-sm transition-all duration-150
                          ${
                            selectedOpt?.ext === opt.ext
                              ? "border-red-600 bg-red-600 text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-700 hover:border-red-400 hover:text-red-600"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {status === "error" && (
                <div className='bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm'>
                  {errorMsg}
                </div>
              )}

              {/* Progress */}
              {status === "converting" && (
                <div className='mb-5'>
                  <div className='flex justify-between text-gray-400 text-xs mb-1.5'>
                    <span>Converting, please wait...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className='w-full bg-gray-100 rounded-full h-1.5'>
                    <div
                      className='bg-red-600 h-1.5 rounded-full transition-all duration-300'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success */}
              {status === "done" && (
                <div className='bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-5 flex items-center gap-4'>
                  <div className='shrink-0 w-9 h-9 bg-red-600 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-gray-800 font-bold text-sm'>
                      Conversion complete
                    </p>
                    <p className='text-gray-400 text-xs mt-0.5'>
                      Your file has been downloaded automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Action button */}
              <div>
                {status !== "done" ? (
                  <button
                    onClick={handleConvert}
                    disabled={!selectedOpt || status === "converting"}
                    className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200
                      ${
                        !selectedOpt || status === "converting"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-md"
                      }`}
                  >
                    {status === "converting" ? "Converting..." : "Convert Now"}
                  </button>
                ) : (
                  <button
                    onClick={reset}
                    className='w-full py-3.5 rounded-xl font-bold text-base bg-red-600 hover:bg-red-700 text-white transition shadow-md'
                  >
                    Convert Another File
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
