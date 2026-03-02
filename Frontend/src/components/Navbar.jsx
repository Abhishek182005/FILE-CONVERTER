import { NavLink } from "react-router-dom";
import { useState } from "react";

const linkClass = ({ isActive }) =>
  isActive
    ? "text-white font-bold border-b-2 border-white pb-0.5 transition"
    : "text-red-100 hover:text-white transition";

const mobileLinkClass = ({ isActive }) =>
  isActive
    ? "block px-4 py-3 text-white font-bold bg-red-700 rounded-lg"
    : "block px-4 py-3 text-red-100 hover:text-white hover:bg-red-700 rounded-lg transition";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='bg-red-600 shadow-md relative z-50'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        {/* Logo */}
        <NavLink
          to='/'
          className='flex items-center gap-2 select-none'
          onClick={() => setMenuOpen(false)}
        >
          <svg
            className='w-6 h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
            />
          </svg>
          <span className='text-white font-black text-xl tracking-tight'>
            Uni<span className='text-red-200'>Convert</span>
          </span>
        </NavLink>

        {/* Desktop nav links */}
        <ul className='hidden md:flex items-center gap-6 text-sm font-medium'>
          <li>
            <NavLink to='/' end className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to='/formats' className={linkClass}>
              Formats
            </NavLink>
          </li>
          <li>
            <NavLink to='/about' className={linkClass}>
              About
            </NavLink>
          </li>
        </ul>

        {/* Right side */}
        <div className='flex items-center gap-2'>
          <span className='hidden sm:inline bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30'>
            Free &amp; Open Source
          </span>
          {/* Hamburger button */}
          <button
            className='md:hidden text-white p-2 rounded-lg hover:bg-red-700 transition'
            onClick={() => setMenuOpen((v) => !v)}
            aria-label='Toggle navigation menu'
          >
            {menuOpen ? (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className='md:hidden bg-red-600 border-t border-red-700 px-4 pb-4'>
          <ul className='flex flex-col gap-1 mt-2'>
            <li>
              <NavLink
                to='/'
                end
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/formats'
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Formats
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about'
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
