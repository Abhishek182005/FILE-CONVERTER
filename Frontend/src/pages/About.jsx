import { Link } from "react-router-dom";

const STACK = [
  { name: "React", desc: "Frontend UI library" },
  { name: "Vite", desc: "Lightning-fast dev server and bundler" },
  { name: "Tailwind CSS", desc: "Utility-first CSS framework" },
  { name: "Node.js", desc: "Backend runtime" },
  { name: "Express", desc: "REST API server" },
  { name: "Multer", desc: "File upload handling" },
  { name: "PDFKit", desc: "PDF generation from TXT / images" },
  { name: "Sharp", desc: "High-performance image conversion" },
  { name: "docx-pdf", desc: "Word document to PDF conversion" },
  { name: "docx", desc: "Create DOCX files from plain text" },
  { name: "XLSX", desc: "Excel and CSV conversion" },
];

export default function About() {
  return (
    <div className='bg-white min-h-screen'>
      {/* Page header */}
      <div className='bg-red-600 py-8 sm:py-12'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <h1 className='text-2xl sm:text-4xl font-black text-white mb-3'>
            About UniConvert
          </h1>
          <p className='text-red-100 text-base'>
            A free, open-source universal file converter built with the MERN
            stack.
          </p>
        </div>
      </div>

      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 sm:space-y-12'>
        {/* What is it */}
        <section>
          <h2 className='text-2xl font-black text-gray-800 mb-4'>
            What is UniConvert?
          </h2>
          <p className='text-gray-600 leading-relaxed'>
            UniConvert is a full-stack web application that lets you convert
            files between different formats directly in your browser — no
            sign-up, no ads, no file-size tricks. All conversions are processed
            on the server and your files are automatically deleted after
            delivery.
          </p>
        </section>

        {/* How it works */}
        <section>
          <h2 className='text-2xl font-black text-gray-800 mb-6'>
            How it works
          </h2>
          <div className='grid sm:grid-cols-3 gap-4'>
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Select or drag-and-drop your file onto the converter.",
              },
              {
                step: "2",
                title: "Convert",
                desc: "Choose your desired output format and click Convert Now.",
              },
              {
                step: "3",
                title: "Download",
                desc: "Your converted file downloads automatically in seconds.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className='border border-gray-200 rounded-2xl p-6 text-center shadow-sm'
              >
                <div className='w-10 h-10 bg-red-600 text-white font-black text-lg rounded-full flex items-center justify-center mx-auto mb-3'>
                  {s.step}
                </div>
                <h3 className='font-bold text-gray-800 mb-1'>{s.title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className='bg-red-50 border border-red-100 rounded-2xl p-6'>
          <h2 className='text-xl font-black text-gray-800 mb-2'>Privacy</h2>
          <p className='text-gray-600 text-sm leading-relaxed'>
            Your files are uploaded to the server solely for conversion and are
            permanently deleted after 2 minutes. No file content is stored,
            logged, or shared with any third party.
          </p>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className='text-2xl font-black text-gray-800 mb-6'>
            Technology Stack
          </h2>
          <div className='overflow-x-auto rounded-2xl border border-gray-200 shadow-sm'>
            <table className='w-full text-sm min-w-[360px]'>
              <thead>
                <tr className='bg-gray-50 border-b border-gray-200'>
                  <th className='text-left px-5 py-3 font-semibold text-gray-500'>
                    Package
                  </th>
                  <th className='text-left px-5 py-3 font-semibold text-gray-500'>
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                {STACK.map((t, i) => (
                  <tr
                    key={t.name}
                    className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className='px-5 py-3'>
                      <span className='font-mono font-bold text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded'>
                        {t.name}
                      </span>
                    </td>
                    <td className='px-5 py-3 text-gray-500'>{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className='text-center'>
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
