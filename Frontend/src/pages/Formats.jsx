import { Link } from "react-router-dom";

const GROUPS = [
  {
    title: "Documents",
    color: "red",
    rows: [
      {
        input: "DOCX / DOC",
        arrow: "→",
        output: "PDF",
        note: "Word document to PDF",
      },
      { input: "TXT", arrow: "→", output: "PDF", note: "Plain text to PDF" },
      {
        input: "TXT",
        arrow: "→",
        output: "DOCX",
        note: "Plain text to Word document",
      },
    ],
  },
  {
    title: "Spreadsheets",
    color: "red",
    rows: [
      {
        input: "XLSX / XLS",
        arrow: "→",
        output: "CSV",
        note: "Excel to comma-separated values",
      },
      {
        input: "CSV",
        arrow: "→",
        output: "XLSX",
        note: "CSV to Excel spreadsheet",
      },
    ],
  },
  {
    title: "Images",
    color: "red",
    rows: [
      {
        input: "JPG / JPEG",
        arrow: "→",
        output: "PNG, WebP, BMP, TIFF, GIF, AVIF, PDF",
        note: "",
      },
      {
        input: "PNG",
        arrow: "→",
        output: "JPG, WebP, BMP, TIFF, GIF, AVIF, PDF",
        note: "",
      },
      {
        input: "WebP",
        arrow: "→",
        output: "JPG, PNG, BMP, TIFF, GIF, AVIF, PDF",
        note: "",
      },
      {
        input: "BMP",
        arrow: "→",
        output: "JPG, PNG, WebP, TIFF, GIF, AVIF, PDF",
        note: "",
      },
      {
        input: "TIFF",
        arrow: "→",
        output: "JPG, PNG, WebP, BMP, GIF, AVIF, PDF",
        note: "",
      },
      {
        input: "GIF",
        arrow: "→",
        output: "JPG, PNG, WebP, BMP, TIFF, AVIF, PDF",
        note: "",
      },
      {
        input: "AVIF",
        arrow: "→",
        output: "JPG, PNG, WebP, BMP, TIFF, GIF, PDF",
        note: "",
      },
    ],
  },
];

export default function Formats() {
  return (
    <div className='bg-white min-h-screen'>
      {/* Page header */}
      <div className='bg-red-600 py-8 sm:py-12'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 text-center'>
          <h1 className='text-2xl sm:text-4xl font-black text-white mb-3'>
            Supported Formats
          </h1>
          <p className='text-red-100 text-base max-w-lg mx-auto'>
            Every input and output format supported by UniConvert. Select a file
            on the Home page to start converting.
          </p>
        </div>
      </div>

      {/* Tables */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 sm:space-y-10'>
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className='text-xl font-black text-gray-800 mb-4 flex items-center gap-2'>
              <span className='block w-3 h-3 bg-red-600 rounded-sm' />
              {group.title}
            </h2>
            <div className='overflow-x-auto rounded-2xl border border-gray-200 shadow-sm'>
              <table className='w-full text-sm min-w-[480px]'>
                <thead>
                  <tr className='bg-gray-50 border-b border-gray-200'>
                    <th className='text-left px-5 py-3 font-semibold text-gray-500 w-40'>
                      Input
                    </th>
                    <th className='text-left px-5 py-3 font-semibold text-gray-500'>
                      Output
                    </th>
                    {group.rows.some((r) => r.note) && (
                      <th className='text-left px-5 py-3 font-semibold text-gray-500'>
                        Notes
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 last:border-0 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className='px-5 py-3'>
                        <span className='bg-red-600 text-white text-xs font-black px-2 py-1 rounded font-mono'>
                          {row.input}
                        </span>
                      </td>
                      <td className='px-5 py-3 text-gray-700 font-medium'>
                        <span className='text-gray-400 mr-2'>{row.arrow}</span>
                        {row.output}
                      </td>
                      {group.rows.some((r) => r.note) && (
                        <td className='px-5 py-3 text-gray-400'>{row.note}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className='text-center pt-4'>
          <Link
            to='/'
            className='inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md'
          >
            Start Converting
          </Link>
        </div>
      </div>
    </div>
  );
}
