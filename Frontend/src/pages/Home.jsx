import FileConverter from "../components/FileConverter";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Documents",
    desc: "Convert DOCX, DOC and TXT files to PDF or DOCX.",
    icon: (
      <svg
        className='w-7 h-7 text-red-600'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.8}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
    ),
  },
  {
    title: "Images",
    desc: "Convert between JPG, PNG, WebP, BMP, GIF, AVIF, TIFF and PDF.",
    icon: (
      <svg
        className='w-7 h-7 text-red-600'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.8}
          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      </svg>
    ),
  },
  {
    title: "Spreadsheets",
    desc: "Convert XLSX, XLS to CSV and back – instantly.",
    icon: (
      <svg
        className='w-7 h-7 text-red-600'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.8}
          d='M3 10h18M3 14h18M10 3v18M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z'
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className='bg-white min-h-screen'>
      {/* Hero */}
      <div className='bg-red-600 text-white py-10 sm:py-16'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 text-center'>
          <h1 className='text-3xl sm:text-5xl font-black tracking-tight mb-3 sm:mb-4 leading-tight'>
            Universal File Converter
          </h1>
          <p className='text-red-100 text-base sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8'>
            Convert documents, images and spreadsheets — free, fast, and right
            in your browser. No sign-up required.
          </p>
          <div className='flex flex-wrap gap-2 justify-center text-sm'>
            {["DOCX", "TXT", "JPG", "PNG", "WebP", "XLSX", "CSV"].map((f) => (
              <span
                key={f}
                className='bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full font-mono font-semibold'
              >
                {f}
              </span>
            ))}
            <Link
              to='/formats'
              className='bg-white text-red-600 px-3 py-1 rounded-full font-semibold hover:bg-red-50 transition'
            >
              + more formats
            </Link>
          </div>
        </div>
      </div>

      {/* Converter card */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 pb-10 sm:pb-16'>
        <FileConverter />
      </div>

      {/* Feature strips */}
      <div className='border-t border-gray-100 bg-gray-50 py-10 sm:py-14'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <h2 className='text-xl sm:text-2xl font-black text-gray-800 mb-6 sm:mb-8 text-center'>
            What can you convert?
          </h2>
          <div className='grid sm:grid-cols-3 gap-6'>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'
              >
                <div className='w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4'>
                  {f.icon}
                </div>
                <h3 className='font-bold text-gray-800 mb-1'>{f.title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
