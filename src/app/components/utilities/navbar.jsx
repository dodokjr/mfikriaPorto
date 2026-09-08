import React, { useState } from 'react';

const nav = {
  logo: "mfikria",
  menubar: [
    { name: "Home", url: "/app" },
    { name: "Project", url: "/Project" },
    { name: "Blog", url: "/blog" },
    { name: "My Hobbies", url: "/hobbies" },
    { name: "Store", url: "/store" }
  ],
  github_button: {
    name: "Github",
    url: "https://github.com/dodokjr"
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  if (!nav) return null;

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="/app" 
              className="text-xl font-bold uppercase tracking-wider text-pink-500 hover:text-pink-400 transition duration-200"
            >
              {nav.logo}
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {nav.menubar.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="text-slate-300 hover:text-pink-500 transition duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Github Button (Right Side) */}
          <div className="hidden md:block">
            <a
              href={nav.github_button.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-500 transition duration-200 shadow"
            >
              {nav.github_button.name}
            </a>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-md"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 px-4 pt-2 pb-4 space-y-2 border-t border-slate-700">
          {nav.menubar.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-pink-600 transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href={nav.github_button.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-3 px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-500 transition duration-200"
          >
            {nav.github_button.name}
          </a>
        </div>
      )}
    </nav>
  );
}